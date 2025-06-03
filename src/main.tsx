import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Editor from './routes/editor';
import "./index.css";
import './worker';
import { registerNat } from './service/nat/registration';
import Login from './routes/login';

import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import pack from "../package.json";

console.log(`This is natlang.online ${pack.version}, running natc ${pack.dependencies["@nat-lang/nat"]}.`);

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

registerNat();


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/:file?/*" element={<Editor />} />
    </Routes>
  </BrowserRouter>
);

