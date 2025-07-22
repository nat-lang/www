import "./codeblock.css";
import * as monaco from 'monaco-editor';
import { FunctionComponent, useEffect, useState } from "react";
import { CodeblockResp } from '@nat-lang/nat';
import Editor from './editor';
import { getOrCreateMonacoModel } from '../utilities';
import Button from './button';
import { useRuntime } from '../hooks/useRuntime';
import runtime from '../service/nat/client';
import Play from "../icons/play";

type CodeblockProps = {
  parent: string;
  block: CodeblockResp & { id: string };
  className?: string;
}

const Codeblock: FunctionComponent<CodeblockProps> = ({ parent, block, className = "" }) => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const [fileLoaded, setFileLoaded] = useState<boolean>(false);
  const { evaluate, stdout } = useRuntime();

  const dir = `${parent}-codeblocks`;
  const path = `${dir}/${block.id}`;

  useEffect(() => {
    runtime.mkDir(dir).then(
      async () => {
        await runtime.setFile(path, block.out.text);
        setFileLoaded(true);
      }
    );

    getOrCreateMonacoModel(path, async () => block.out.text).then(setModel);

    return () => {
      runtime.rmFile(path);
      model?.dispose();
    };
  }, [path]);

  return <div className={`Codeblock ${className}`}>
    <div className="Codeblock-row flex-row" style={{}}>
      <div className="Codeblock-margin Codeblock-outer-margin" />
      <div className="Codeblock-space" />
      <div className="Codeblock-col flex-col" >
        <Editor
          model={model}
          fitHeightToContent
          onChange={value => runtime.setFile(path, value)}
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
};

export default Codeblock;