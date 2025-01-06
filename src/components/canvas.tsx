

import { FunctionComponent } from "react";
import { CanvasNode } from "../types";
import Tree from "./tree";

type CanvasOps = {
  data?: CanvasNode[];
}

const Canvas: FunctionComponent<CanvasOps> = ({ data }) => {
  return <div>
    {data?.map((datum, dIdx) => <Tree data={datum} key={dIdx} />)}
  </div>
};

export default Canvas;