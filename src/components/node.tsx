import { HierarchyNode } from "d3-hierarchy";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { CanvasNode } from "../types";

type NodeOps = {
  width: number;
  height: number;
  node: HierarchyNode<CanvasNode>
};

const Node: FunctionComponent<
  NodeOps
> = ({ node }) => {
  const ref = useRef<SVGGElement>(null);
  const [x, setX] = useState<number>(node.x ?? 0);
  const [y, setY] = useState<number>(node.y ?? 0);

  useEffect(() => {
    if (ref.current) {
      let bbox = ref.current.getBBox();
      setX(x - (bbox.width / 2));
      setY(y + bbox.height);
    }
  }, [ref]);

  return (
    <g ref={ref}>
      <text x={x} y={y}>
        {node.data.tex}
      </text>
    </g>
  );
};

export default Node