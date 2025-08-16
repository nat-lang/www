import { Fragment, FunctionComponent } from "react";
import Codeblock from "./codeblock";
import StandalonePDF from "./pdf/standalone";
import AnchorPDF from "./pdf/anchor";
import useCanvasCtx from "../context/canvas";
import { sortObjs } from "../utilities";
import FauxAnchor from "./fauxanchor";

type CanvasOps = {
  fsPath: string;
  urlPath?: string;
  style?: React.CSSProperties;
}

const Canvas: FunctionComponent<CanvasOps> = ({ fsPath, urlPath = fsPath, style = {} }) => {
  const { objects } = useCanvasCtx();

  return <div className="Canvas" style={style}>
    <FauxAnchor path={"/" + urlPath} order={0} />

    {sortObjs(objects[fsPath] ?? []).map(
      obj => {
        switch (obj.type) {
          case "tex":
            return <StandalonePDF
              className="Canvas-item"
              key={obj.id}
              file={obj.pdf}
            />
          case "codeblock":
            return <Codeblock
              className="Canvas-item"
              key={obj.id}
              block={obj}
              parent={fsPath}
            />
          case "anchor":
            return <AnchorPDF
              className="Canvas-item"
              key={obj.id}
              path={`${obj.out.path}#${obj.out.title}`}
              file={obj.pdf}
              order={obj.order}
            />
          default:
            return undefined;
        }
      }
    )}
  </div>;
};

export default Canvas;