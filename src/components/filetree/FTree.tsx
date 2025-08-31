import { FunctionComponent } from "react";
import { FileTree } from "../../context/file";
import Caret from "../../icons/caret";
import FArray from "./FArray";

type FTreeOps = {
  node: FileTree;
  title: string;
  open: boolean;
  depth: number;
  parent: FileTree;
}

const FTree: FunctionComponent<FTreeOps> = ({ node, title, depth, open = false }) => {
  console.log(node);
  return <div className={`FileTreeFolder ${!open ? "FileTreeFolder--closed" : ""}`}>
    <div className="FileTreeFileTitle flex">
      <Caret className="icon" /> {title}
    </div>
    <FArray nodes={node.children ?? []} depth={depth + 1} parent={node} />
  </div>
};

export default FTree;