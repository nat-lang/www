import { FunctionComponent } from "react";
import { RepoFileTree } from "../../context/file";
import Caret from "../../icons/caret";
import FTree from "./FTree";
import FBlob from "./FBlob";
import { fmtTitle } from "./conf";

type FArrayOps = {
  parent: RepoFileTree;
  nodes: RepoFileTree[];
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