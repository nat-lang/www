

import { tree as defineTree, hierarchy } from "d3-hierarchy";
import { FunctionComponent } from "react";
import Node from "./node";
import { CanvasNode } from "../types";
import Edge from "./edge";

type TreeOps = {
  data: CanvasNode;
}

const nodeWidth = 5, nodeHeight = 50, fontHeight = 19;

const coordinate = defineTree<CanvasNode>().nodeSize([
  nodeWidth,
  nodeHeight
]).separation((a, b) => {
  console.log(a.data.tex, b.data.tex);
  return 10;
});

const Tree: FunctionComponent<TreeOps> = ({ data }) => {
  let annotatedData = hierarchy(data);
  let root = coordinate(annotatedData);
  let descendants = root.descendants();

  let width = 250, height = (nodeHeight + fontHeight) * root.height;
  return <svg
    width={width}
    height={height}
    // force a rerender when any of the data changes.
    key={JSON.stringify(data)}
  >
    <g transform={`translate(${width / 2}, 0)`}>
      {root.links()
        .map((link, lIdx) => <Edge
          link={link}
          key={lIdx} />
        )}
      {descendants.map(
        (node, nIdx) => {
          return <Node width={5} height={5} node={node} key={nIdx} />
        }
      )}
    </g>
  </svg>
};

export default Tree;