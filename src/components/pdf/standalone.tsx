

import { CSSProperties, forwardRef, useEffect, useState } from "react";
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

  const handlePageClick = (e: MouseEvent) => {
    if (!e.target) return;
    if (e.target === null || (e.target as HTMLElement).tagName !== 'A') return;

    const target = e.target as HTMLAnchorElement;
    const url = new URL(target.href);

    if (url.hostname !== window.location.hostname) return;

    e.preventDefault();
    navigate(url.pathname + url.hash);
  };

  useEffect(() => {
    if (pages > 1) throw new Error(`Standalone PDF expects a single page document; got ${pages} pages.`);
  }, [pages]);

  return <div className={`Standalone ${className}`} style={style} ref={ref} data-path={path}>
    {file && <Document file={`data:application/pdf;base64,${file}`} onLoadSuccess={({ numPages }) => setPages(numPages)}>
      <Page onClick={handlePageClick} pageNumber={1} canvasRef={handlePageRef} renderTextLayer={false} scale={scale} />
    </Document>}
  </div>
});

export default Standalone;