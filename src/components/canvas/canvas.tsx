import { FunctionComponent, useEffect, useRef } from "react";
import Codeblock from "./codeblock";
import StandalonePDF from "./pdf/standalone";
import useCanvasCtx, { CanvasObj } from "../../context/canvas";
import { sortObjs } from "../../utilities";
import FauxAnchor from "./fauxanchor";
import { useLocation } from "react-router-dom";
import Markdown from "./markdown";
import Anchor from "./anchor";

type CanvasOps = {
  style?: React.CSSProperties;
  objects: CanvasObj[];
  width: number;
}

const Canvas: FunctionComponent<CanvasOps> = ({ objects, width, style = {} }) => {
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
                width={width}
              />
            case "anchor":
              return <Anchor
                className="Canvas-item"
                key={obj.id}
                path={`${obj.out.path}#${obj.slug}`}
                order={obj.order}
              >{obj.out.md}</Anchor>
            case "markdown":
              return <Markdown
                className="Canvas-item"
                key={obj.id}
              >{obj.out}</Markdown>
            default:
              return undefined;
          }
        }
      )}
    </div>
  </div>;
};

export default Canvas;