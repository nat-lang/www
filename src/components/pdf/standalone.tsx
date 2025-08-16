

import { CSSProperties, forwardRef, useState } from "react";
import { Document, Page } from "react-pdf";
import "./standalone.css";
import useDimsCtx from "../../context/dims";

export type StandaloneProps = {
  file?: string;
  style?: CSSProperties;
  className?: string;
  path?: string;
}

const Standalone = forwardRef<HTMLDivElement, StandaloneProps>(({ file, style, path, className = "" }, ref) => {
  const { scale } = useDimsCtx();
  const [pages, setPages] = useState(0);
  const pageIndices: number[] = Array(pages).fill(0).reduce((cum, _, idx) => [...cum, idx + 1], []);

  return <div className={`Standalone ${className}`} style={style} ref={ref} data-path={path}>
    {file && <Document file={`data:application/pdf;base64,${file}`} onLoadSuccess={({ numPages }) => setPages(numPages)}>
      {pageIndices.map(idx => <Page key={idx} pageNumber={idx} renderTextLayer={false} scale={scale} />)}
    </Document>}
  </div>
});

export default Standalone;