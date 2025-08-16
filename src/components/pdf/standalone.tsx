

import { CSSProperties, forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const docRef = useRef<HTMLDivElement | null>(null);
  const { scale, setMaxPdfWidth } = useDimsCtx();
  const [pages, setPages] = useState(0);

  useEffect(() => {
    if (pages > 1) throw new Error(`Standalone PDF expects a single page document; got ${pages} pages.`);
  }, [pages]);

  console.log(docRef);
  useLayoutEffect(() => {
    if (!docRef.current) return;
    console.log("up max: ", docRef.current.offsetWidth)
    setMaxPdfWidth(docRef.current.offsetWidth);
  }, [docRef.current?.offsetWidth]);

  return <div className={`Standalone ${className}`} style={style} ref={ref} data-path={path}>
    {file && <Document file={`data:application/pdf;base64,${file}`} onLoadSuccess={({ numPages }) => setPages(numPages)}>
      <Page inputRef={docRef} pageNumber={1} renderTextLayer={false} scale={scale} />
    </Document>}
  </div>
});

export default Standalone;