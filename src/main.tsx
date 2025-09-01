import { createRoot } from 'react-dom/client';
import './worker';
import pack from "../package.json";
import { installSyntax } from './service/nat/syntax';
import runtime from './service/nat/client';
import Runtime from '@nat-lang/nat';
import { RouterProvider } from 'react-router-dom';
import { confPdfjs } from './service/pdf';
import { router } from './router';

declare global {
  interface Window { runtime: Runtime; }
}

window.runtime = window.runtime || runtime;

console.log(`This is natlang.online ${pack.version}, running natc ${pack.dependencies["@nat-lang/nat"]}.`);

installSyntax();
confPdfjs();

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
