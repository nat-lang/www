

import { FunctionComponent, useEffect, useRef, useState } from "react";
import Tree from "./tree";
import { CompilationNode } from "../service/nat/client";
import "./canvas.css";

type CanvasOps = {
  data?: CompilationNode[];
}

const Canvas: FunctionComponent<CanvasOps> = ({ data }) => {
  const [width, setWidth] = useState(0);
  let ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      setWidth(entry.contentRect.width);
      console.log(entry.contentRect.width);
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, []);

  return <div className="Canvas" ref={ref}>
    <div className="CanvasPane">
      {data?.map((datum, dIdx) => <Tree
        data={datum}
        key={dIdx}
        pWidth={width}
      />)}
    </div>

  </div>
};

export default Canvas;