

import { FunctionComponent, useRef } from "react";
import Tree from "./tree";
import { CompilationNode } from "../service/nat/client";


type CanvasOps = {
  data?: CompilationNode[];
}

const Canvas: FunctionComponent<CanvasOps> = ({ data }) => {
  let ref = useRef<HTMLDivElement>(null);

  return <div className="Canvas" ref={ref}>
    {data?.map((datum, dIdx) => <Tree data={datum} key={dIdx} pWidth={ref.current?.getBoundingClientRect().width} />)}
  </div>
};

export default Canvas;