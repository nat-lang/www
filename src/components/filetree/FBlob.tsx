import { FunctionComponent } from "react";
import { FileTree } from "../../context/file";
import { iconWidth } from "./conf";
import { Link, useLocation } from "react-router-dom";

type FBlobOps = {
  node: FileTree;
  title: string;
  depth: number;
}

const FBlob: FunctionComponent<FBlobOps> = ({ node, title, depth }) => {
  const location = useLocation();
  const active = location.pathname === node.path;

  return <Link to={node.path}><div
    className={`FileTreeFile ${active ? "FileTreeFile--active" : ""}`}
    style={{ paddingLeft: iconWidth + 5 * depth }}
  >
    <div className="FileTreeFileTitle">
      <span>{title}</span>
    </div>
  </div></Link>
};

export default FBlob;