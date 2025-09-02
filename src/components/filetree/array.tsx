import { FunctionComponent } from "react";
import { FileTree } from "../../context/file";
import Leaf from "./leaf";
import { fmtTitle } from "./conf";
import Node from "./node";

type FileTreeArrayOps = {
  parent: FileTree;
  nodes: FileTree[];
  depth: number;
}

const FileTreeArray: FunctionComponent<FileTreeArrayOps> = ({ nodes, depth, parent }) => {
  return nodes.map(
    node => node.type === "tree"
      ? <Node key={node.path} node={node} title={fmtTitle(node.path, parent.path)} open depth={depth} parent={parent} />
      : node.type === "blob"
        ? <Leaf key={node.path} node={node} title={fmtTitle(node.path, parent.path)} depth={depth} />
        : undefined
  );

};

export default FileTreeArray;