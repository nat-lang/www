import { FunctionComponent } from "react";
import StandalonePDF from "./pdf/standalone";
import useCanvasCtx from "../context/canvas";
import { sortObjs } from "../utilities";

type CodeblockCanvasOps = {
  fsPath: string;
  style?: React.CSSProperties;
}

const CodeblockCanvas: FunctionComponent<CodeblockCanvasOps> = ({ fsPath, style = {} }) => {
  const { objects } = useCanvasCtx();

  return <div className="CodeblockCanvas" style={style}>
    {sortObjs(objects[fsPath] ?? []).map(
      obj => {
        switch (obj.type) {
          case "tex":
            return <StandalonePDF
              className="CodeblockCanvas-item"
              key={obj.id}
              file={obj.pdf}
            />
          default:
            return undefined;
        }
      }
    )}
  </div>;
};

export default CodeblockCanvas;