import { FunctionComponent } from "react";
import { FileTree } from "../../context/file";
import FBlob from "./FBlob";
import { fmtTitle } from "./conf";
import FTree from "./FTree";

type FArrayOps = {
  parent: FileTree;
  nodes: FileTree[];
  depth: number;
}

const FArray: FunctionComponent<FArrayOps> = ({ nodes, depth, parent }) => {
  console.log(nodes);

  return nodes.map(
    node => node.type === "tree"
      ? <FTree node={node} title={fmtTitle(node.path, parent.path)} open depth={depth} parent={parent} />
      : node.type === "blob"
        ? <FBlob node={node} title={fmtTitle(node.path, parent.path)} depth={depth} />
        : undefined
  );

};

export default FArray;