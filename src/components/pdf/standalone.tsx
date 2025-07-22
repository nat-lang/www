

import { CSSProperties, FunctionComponent, useState } from "react";
import { Document, Page } from "react-pdf";
import "./standalone.css";
import Plus from "../../icons/plus";
import Minus from "../../icons/minus";

type StandaloneOps = {
  file?: string;
  style?: CSSProperties;
  initialScale?: number;
  className?: string;
  scalable?: boolean;
}

const SCALE_STEP = 0.1;

const Standalone: FunctionComponent<StandaloneOps> = ({ file, style, scalable = false, className = "", initialScale = 1 }) => {
  const [scale, setScale] = useState(initialScale);
  const [pages, setPages] = useState(0);
  const handleZoomin = () => setScale(scale => scale + SCALE_STEP);
  const handleZoomout = () => setScale(scale => scale > 0 ? scale - SCALE_STEP : scale);

  const pageIndices: number[] = Array(pages).fill(0).reduce((cum, _, idx) => [...cum, idx + 1], []);

  return <div className={`Standalone ${className}`} style={style}>
    {scalable && <div className="Standalone-toolbar">
      <Plus className="Standalone-zoom-in" onClick={handleZoomin} />
      <Minus className="Standalone-zoom-out" onClick={handleZoomout} />
    </div>}
    <div className="Standalone-scrollguard">
      {file && <Document file={`data:application/pdf;base64,${file}`} onLoadSuccess={({ numPages }) => setPages(numPages)}>
        {pageIndices.map(idx => <Page key={idx} pageNumber={idx} renderTextLayer={false} scale={scale} />)}
      </Document>}
      <div className="StandalonePane"></div>
    </div>
  </div>
};

export default Standalone;