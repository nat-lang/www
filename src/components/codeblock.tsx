import "./codeblock.css";
import { forwardRef, useEffect, useState } from "react";
import { CodeblockResp } from '@nat-lang/nat';
import Monaco from './monaco';
import Button from './button';
import { useRuntime } from '../hooks/useRuntime';
import runtime from '../service/nat/client';
import Play from "../icons/play";
import useModelCtx, { useModel } from "../context/monaco";
import useDimsCtx from "../context/dims";
import { useShallow } from "zustand/react/shallow";

type CodeblockProps = {
  parent: string;
  block: CodeblockResp & { id: string };
  className?: string;
}

const Codeblock = forwardRef<HTMLDivElement, CodeblockProps>(
  ({ parent, block, className = "" }, ref) => {
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const { evaluate, stdout } = useRuntime();
    const { maxPdfWidth } = useDimsCtx(useShallow(({ maxPdfWidth }) => ({ maxPdfWidth })));
    const dir = `${parent}-codeblocks`;
    const path = `${dir}/${block.id}`;
    const { delModel } = useModelCtx();
    const model = useModel(path, block.out.text);

    useEffect(() => {
      if (model)
        return () => delModel(path);
    }, [model]);

    useEffect(() => {
      if (fileLoaded) return;

      runtime.mkDir(dir)
        .then(() => runtime.setFile(path, block.out.text))
        .then(() => setFileLoaded(true));

      return () => {
        if (fileLoaded) runtime.rmFile(path).then(
          () => setFileLoaded(false)
        );
      };
    }, [path, fileLoaded]);

    return <div className={`Codeblock ${className}`} style={{ maxWidth: maxPdfWidth ?? undefined }} ref={ref} >
      <div className="Codeblock-row flex-row">
        <div className="Codeblock-margin Codeblock-outer-margin" />
        <div className="Codeblock-space" />
        <div className="Codeblock-col flex-col" >
          <Monaco
            model={model}
            fitHeightToContent
            options={{
              lineNumbers: "off",
              scrollbar: {
                vertical: "hidden",
                verticalSliderSize: 0,
                handleMouseWheel: false,
              },
              renderLineHighlight: "none",
              stickyScroll: { enabled: false },
              scrollBeyondLastLine: false
            }}
          />

          {stdout.length > 0 && <div className="Codeblock-out flex-row">
            <div className="Codeblock-margin Codeblock-inner-margin" />
            <div className="Codeblock-space" />
            <div className="Codeblock-stdout flex-col">
              {stdout.map(
                (x, idx) => <div key={idx} className="Codeblock-stdout-line">{x}</div>
              )}
            </div>
          </div>}
        </div>
      </div>
      <Button
        className="Button-eval"
        disabled={!fileLoaded}
        onClick={() => fileLoaded && evaluate(path)}
      >
        <Play />
      </Button>
    </div>
  }
);

export default Codeblock;