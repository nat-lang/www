

import { CSSProperties, FunctionComponent, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import "./canvas.css";
import Plus from "../icons/plus";
import Minus from "../icons/minus";

type CanvasOps = {
  file?: string;
  style?: CSSProperties;
}

const SCALE_STEP = 0.1;

const Canvas: FunctionComponent<CanvasOps> = ({ file, style }) => {
  const [scale, setScale] = useState(1);
  const [pages, setPages] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const handleZoomin = () => setScale(scale => scale + SCALE_STEP);
  const handleZoomout = () => setScale(scale => scale > 0 ? scale - SCALE_STEP : scale);

  const pageIndices: number[] = Array(pages).fill(0).reduce((cum, _, idx) => [...cum, idx + 1], []);

  return <div className="Canvas" ref={ref} style={style}>
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