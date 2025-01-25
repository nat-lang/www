

import { FunctionComponent, useEffect, useRef, useState } from "react";
import { CompilationNode } from "../service/nat/client";
import { Document, Page } from "react-pdf";
import "./canvas.css";
import Plus from "../icons/plus";
import Minus from "../icons/minus";

type CanvasOps = {
  data?: CompilationNode[];
  file?: string;
}

const SCALE_STEP = 0.1;

const Canvas: FunctionComponent<CanvasOps> = ({ data, file }) => {
  const [width, setWidth] = useState(0);
  const [scale, setScale] = useState(1);
  const [pages, setPages] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const handleZoomin = () => setScale(scale => scale + SCALE_STEP);
  const handleZoomout = () => setScale(scale => scale > 0 ? scale - SCALE_STEP : scale);

  const pageIndices: number[] = Array(pages).fill(0).reduce((cum, _, idx) => [...cum, idx + 1], []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      setWidth(entry.contentRect.width);
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
    <div className="Canvas-toolbar">
      <Plus className="Canvas-zoom-in" onClick={handleZoomin} />
      <Minus className="Canvas-zoom-out" onClick={handleZoomout} />
    </div>
    {file && <Document file={`data:application/pdf;base64,${file}`} onLoadSuccess={({ numPages }) => setPages(numPages)}>
      {pageIndices.map(idx => <Page key={idx} pageNumber={idx} renderTextLayer={false} scale={scale} />)}
    </Document>}
    <div className="CanvasPane"></div>
  </div>
};

export default Canvas;