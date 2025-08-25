import "./codeblock.css";
import { forwardRef, useEffect, useState } from "react";
import Monaco from './monaco';
import Button from './button';
import { useRuntime } from '../hooks/useRuntime';
import runtime from '../service/nat/client';
import Play from "../icons/play";
import useModelCtx, { useModel } from "../context/monaco";
import useDimsCtx from "../context/dims";
import { useShallow } from "zustand/react/shallow";
import useCanvasCtx from "../context/canvas";
import { sortObjs } from "../utilities";
import StandalonePDF from "./pdf/standalone";
import Check from "../icons/check";
import LoadingGear from "../icons/loadingGear";
import { StampedCodeblockResp } from "../types";
import Exclaim from "../icons/exclaim";

type CodeblockProps = {
  parent: string;
  block: StampedCodeblockResp;
  className?: string;
}

const Codeblock = forwardRef<HTMLDivElement, CodeblockProps>(
  ({ parent, block, className = "" }, ref) => {
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const { evaluate, evaluating, rendering, stdout, stderr } = useRuntime();
    const { objects } = useCanvasCtx();
    const maxPdfWidth = useDimsCtx(useShallow(state => state.maxPdfWidth));
    const dir = `${parent}-codeblocks`;
    const path = `/${dir}/${block.id}`;
    const { delModel } = useModelCtx();
    const model = useModel(path, block.out.text);
    const [dirty, setDirty] = useState(false);
    const [animateCompletion, setAnimateCompletion] = useState(false);

    const handleEval = async () => {
      if (!fileLoaded) return;

      const file = await runtime.getFile(path);
      await runtime.setFile(path, `use ../.common\n${file.content}`);

      await evaluate(path);
      setDirty(true);
    };

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

    useEffect(() => {
      if (!evaluating && !rendering) {
        setAnimateCompletion(true);
        const timeout = setTimeout(() => setAnimateCompletion(false), 1000);
        return () => clearTimeout(timeout);
      }
    }, [evaluating, rendering]);

    return <div className={`Codeblock ${className}`} style={{ maxWidth: maxPdfWidth ?? undefined }} ref={ref} >
      <div className="Codeblock-row flex-row">
        <div className="Codeblock-space" />
        <div className="flex-col flex-grow" >
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

          {objects[path]?.length > 0 && <div className="Codeblock-out flex-row">
            <div className="Codeblock-margin" />
            <div className="Codeblock-space" />
            <div className="CodeblockCanvas">
              {sortObjs(objects[path] ?? []).map(
                obj => {
                  switch (obj.type) {
                    case "tex":
                      return <StandalonePDF
                        className="CodeblockCanvas-item"
                        key={obj.id}
                        file={obj.pdf}
                      />
                    case "string":
                      return <div className="CodeblockCanvas-item" key={obj.id}>{obj.out}</div>
                    default:
                      return undefined;
                  }
                }
              )}
            </div>
          </div>}

          {stdout.length > 0 && <div className="Codeblock-out flex-row">
            <div className="Codeblock-margin" />
            <div className="Codeblock-space" />
            <div className="flex-col">
              {stdout.map(
                (x, idx) => <div key={idx}>{x}</div>
              )}
            </div>
          </div>}

          {stderr.length > 0 && <div className="Codeblock-out flex-row">
            <div className="Codeblock-margin err" />
            <div className="Codeblock-space" />
            <div className="flex-col">
              {stderr.map(
                (x, idx) => <div key={idx}>{x}</div>
              )}
            </div>
          </div>}
        </div>
      </div>
      <Button
        className={`Button-eval ${stderr.length > 0 ? "err" :
          evaluating || rendering
            ? "progress"
            : animateCompletion
              ? "flourish"
              : dirty
                ? "complete"
                : "steady"
          }`
        }
        disabled={!fileLoaded}
        onClick={handleEval}
      >
        <Play />
        <LoadingGear />
        <Check className={animateCompletion ? "flourish" : ""} />
        <Exclaim />
      </Button>
    </div>
  }
);

export default Codeblock;