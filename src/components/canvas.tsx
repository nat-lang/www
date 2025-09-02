import { FunctionComponent, useEffect, useRef } from "react";
import Codeblock from "./codeblock";
import StandalonePDF from "./pdf/standalone";
import AnchorPDF from "./pdf/anchor";
import useCanvasCtx, { CanvasObj } from "../context/canvas";
import { sortObjs } from "../utilities";
import FauxAnchor from "./fauxanchor";
import { useLocation } from "react-router-dom";

type CanvasOps = {
  style?: React.CSSProperties;
  objects: CanvasObj[];
}

const Canvas: FunctionComponent<CanvasOps> = ({ objects, style = {} }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const path = useLocation().pathname;
  const canvasCtx = useCanvasCtx();

  useEffect(() => {
    canvasCtx.setPageRef(ref);
    return canvasCtx.delPageRef;
  }, []);

  return <div className="Canvas" ref={ref}>
    <div className="CanvasPane" style={style}>
      <FauxAnchor path={path} order={0} />

      {sortObjs(objects).map(
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
                parent={path}
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
    </div>
  </div>;
};

export default Canvas;