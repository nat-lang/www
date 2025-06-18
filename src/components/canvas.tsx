

import { CSSProperties, FunctionComponent, useState } from "react";
import { Document, Page } from "react-pdf";
import "./canvas.css";
import Plus from "../icons/plus";
import Minus from "../icons/minus";

type CanvasOps = {
  file?: string;
  style?: CSSProperties;
  initialScale?: number;
}

const SCALE_STEP = 0.1;

const Canvas: FunctionComponent<CanvasOps> = ({ file, style, initialScale = 1 }) => {
  const [scale, setScale] = useState(initialScale);
  const [pages, setPages] = useState(0);
  const handleZoomin = () => setScale(scale => scale + SCALE_STEP);
  const handleZoomout = () => setScale(scale => scale > 0 ? scale - SCALE_STEP : scale);

  const pageIndices: number[] = Array(pages).fill(0).reduce((cum, _, idx) => [...cum, idx + 1], []);

  return <div className="Canvas" style={style}>
    <div className="Canvas-toolbar">
      <Plus className="Canvas-zoom-in" onClick={handleZoomin} />
      <Minus className="Canvas-zoom-out" onClick={handleZoomout} />
    </div>
    <div className="Canvas-scrollguard">
      {file && <Document file={`data:application/pdf;base64,${file}`} onLoadSuccess={({ numPages }) => setPages(numPages)}>
        {pageIndices.map(idx => <Page key={idx} pageNumber={idx} renderTextLayer={false} scale={scale} />)}
      </Document>}
      <div className="CanvasPane"></div>
    </div>
  </div>
};

export default Canvas;