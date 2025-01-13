

import { FunctionComponent, useEffect, useRef, useState } from "react";
import { CanvasNode } from "../types";
import Tree from "./tree";


type CanvasOps = {
  data?: CanvasNode[];
}

const Canvas: FunctionComponent<CanvasOps> = ({ data }) => {
  let ref = useRef<HTMLDivElement>(null);

  return <div className="Canvas" ref={ref}>
    {data?.map((datum, dIdx) => <Tree data={datum} key={dIdx} pWidth={ref.current?.getBoundingClientRect().width} />)}
  </div>
};

export default Canvas;