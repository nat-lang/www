import { HierarchyNode } from "d3-hierarchy";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { CanvasNode } from "../types";
import "./node.css";
import katex from "katex";

type NodeOps = {
  width: number;
  height: number;
  node: HierarchyNode<CanvasNode>
};

const Node: FunctionComponent<
  NodeOps
> = ({ node }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState<number>(node.x ?? 0);

  useEffect(() => {
    if (ref.current && node.data.tex) {
      katex.render(node.data.tex, ref.current, { output: "mathml" });

      let bbox = ref.current.getBoundingClientRect();
      setX(x - (bbox.width / 2));
    }
  }, [ref]);

  return (
    <g x={x} y={node.y}>
      <foreignObject x={x} y={node.y}>
        <div ref={ref} />
      </foreignObject>
    </g>
  );
};

export default Node