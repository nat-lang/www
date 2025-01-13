

import { tree as defineTree, hierarchy } from "d3-hierarchy";
import { FunctionComponent } from "react";
import Node from "./node";
import { CanvasNode } from "../types";
import Edge from "./edge";
import katex from "katex";

type TreeOps = {
  data: CanvasNode;
  pWidth?: number;
}

const measure = (html: string): number => {
  var dims = document.querySelector("#dims");

  if (!dims) throw new Error("Couldn't find dimension div.");

  dims.insertAdjacentHTML("beforeend", html);

  if (!dims.lastChild) throw new Error("Failed to insert katex html for dimension measure.");

  return (dims.lastChild as HTMLSpanElement).getBoundingClientRect().width;
}

const nodeWidth = 10, nodeHeight = 50, fontHeight = 19, nodeSep = 10;

const coordinate = defineTree<CanvasNode>().nodeSize([
  nodeWidth,
  nodeHeight
]).separation((a, b) => {
  if (a.data.html && b.data.html) {
    let aWidth = measure(a.data.html),
      bWidth = measure(b.data.html);

    let sep = (aWidth + bWidth) / 2;
    let diff = (nodeWidth * nodeSep) - sep;

    return diff < 0 ? sep / nodeWidth + 1 : nodeSep;
  }
  return nodeSep;
});

const Tree: FunctionComponent<TreeOps> = ({ data, pWidth }) => {
  let annotatedData = hierarchy(data);

  annotatedData.each(
    node => {
      if (node.data.tex)
        node.data.html = katex.renderToString(node.data.tex, { output: "mathml" });
    }
  )
  let root = coordinate(annotatedData);
  let descendants = root.descendants();

  let height = (nodeHeight + fontHeight) * root.height;
  return pWidth ? (
    <svg
      width={pWidth}
      height={height}
      // force a rerender when any of the data changes.
      key={JSON.stringify(data)}
    >
      <g transform={`translate(${pWidth / 2}, 0)`}>
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
  ) : <></>;
};

export default Tree;