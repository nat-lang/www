import { FunctionComponent } from "react";
import { FileTree } from "../../context/file";
import { iconWidth } from "./conf";
import { Link } from "react-router-dom";

type FBlobOps = {
  node: FileTree;
  title: string;
  depth: number;
}

const FBlob: FunctionComponent<FBlobOps> = ({ node, title, depth }) => {
  console.log(title);
  return <Link to={"/" + node.path}><div
    className={`FileTreeFile`}
    style={{ paddingLeft: iconWidth + 5 * depth }}
  >
    <div className="FileTreeFileTitle">
      <span>{title}</span>
    </div>
  </div></Link>
};

export default FBlob;