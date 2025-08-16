import { createRoot } from 'react-dom/client';
import './worker';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import pack from "../package.json";
import { installSyntax } from './service/nat/syntax';
import App from "./app";
import runtime from './service/nat/client';
import Runtime from '@nat-lang/nat';
import { BrowserRouter } from 'react-router-dom';

declare global {
  interface Window { runtime: Runtime; }
}

window.runtime = window.runtime || runtime;

console.log(`This is natlang.online ${pack.version}, running natc ${pack.dependencies["@nat-lang/nat"]}.`);

installSyntax();

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

createRoot(document.getElementById('root')!).render(<BrowserRouter><App /></BrowserRouter>);
