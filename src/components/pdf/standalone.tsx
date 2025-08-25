

import { CSSProperties, EventHandler, forwardRef, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import "./standalone.css";
import useDimsCtx from "../../context/dims";
import { useShallow } from "zustand/react/shallow";
import { useNavigation } from "../../hooks/useNavigation";

export type StandaloneProps = {
  file?: string;
  style?: CSSProperties;
  className?: string;
  path?: string;
}

const Standalone = forwardRef<HTMLDivElement, StandaloneProps>(({ file, style, path, className = "" }, ref) => {
  const { scale, setMaxPdfWidth } = useDimsCtx(useShallow(({ scale, setMaxPdfWidth }) => ({ scale, setMaxPdfWidth })));
  const [pages, setPages] = useState(0);
  const { navigate } = useNavigation();

  const handlePageRef = (node: HTMLCanvasElement) => {
    if (!node) return;
    setMaxPdfWidth(node.offsetWidth);
  };

  useEffect(() => {
    if (pages > 1) throw new Error(`Standalone PDF expects a single page document; got ${pages} pages.`);
  }, [pages]);

  return <div className={`Standalone ${className}`} style={style} ref={ref} data-path={path}>
    {file && <Document file={`data:application/pdf;base64,${file}`} onLoadSuccess={({ numPages }) => setPages(numPages)}>
      <Page onClick={(e) => {
        if (!e.target?.href) return;
        if (typeof e.target.href !== "string") return;

        const url = new URL(e.target.href);

        if (url.hostname !== window.location.hostname) return;

        e.preventDefault();
        navigate(url.pathname);
      }} pageNumber={1} canvasRef={handlePageRef} renderTextLayer={false} scale={scale} />
    </Document>}
  </div>
});

export default Standalone;