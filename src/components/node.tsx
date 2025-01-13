import { HierarchyNode } from "d3-hierarchy";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { CanvasNode } from "../types";
import "./node.css";

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

  console.log(node.data.tex, node.x);
  useEffect(() => {
    if (ref.current) {
      let bbox = ref.current.getBoundingClientRect();
      setX(x - (bbox.width / 2));
    }
  }, [ref]);

  return (
    <g x={x} y={node.y}>
      <foreignObject x={x} y={node.y}>
        {node.data.html && <div dangerouslySetInnerHTML={{ __html: node.data.html }} ref={ref} />}
      </foreignObject>
    </g>
  );
};

export default Node