import { FunctionComponent } from "react";
import { FileTree } from "../../context/file";
import { iconWidth } from "./conf";
import { Link, useLocation } from "react-router-dom";
import { TypesetAnchorResp } from "../../types";
import useCanvasCtx from "../../context/canvas";

type FBlobOps = {
  node: FileTree;
  title: string;
  depth: number;
}

const FBlob: FunctionComponent<FBlobOps> = ({ node, title, depth }) => {
  const location = useLocation();
  const canvasCtx = useCanvasCtx();
  const objs = canvasCtx.objects[node.path] ?? [];

  let activeAnchor: TypesetAnchorResp | undefined;
  let anchors: TypesetAnchorResp[] = [];

  for (const obj of objs) {
    if (obj.type !== "anchor") continue;
    anchors.push(obj);
    if (`${location.pathname}${location.hash}` === `${obj.out.path}#${obj.out.title}`)
      activeAnchor = obj;
  }

  console.log(activeAnchor)

  const active = location.pathname === node.path && !activeAnchor;
  const paddingLeft = iconWidth + 5 * depth;

  return <>
    <Link to={node.path}><div
      className={`FileTreeFile ${active ? "FileTreeFile--active" : ""}`}
      style={{ paddingLeft }}
    >
      <div className="FileTreeFileTitle">
        <span>{title}</span>
      </div>
    </div></Link>
    {anchors.map(
      anchor => <Link
        key={`${node.path}-${anchor.out.title}`}
        to={`${location.pathname === anchor.out.path ? "" : anchor.out.path}#${anchor.out.title}`}
      >
        <div
          className={`FileTreeAnchor ${activeAnchor && activeAnchor.out === anchor.out ? "FileTreeAnchor--active" : ""}`}
          style={{ paddingLeft: paddingLeft + 5 }}
        >
          <div className="FileTreeAnchorTitle">
            <span data-order={anchor.order}>{anchor.out.title}</span>
          </div>
        </div>
      </Link>
    )}

  </>
};

export default FBlob;