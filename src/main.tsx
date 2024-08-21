import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import Editor from './routes/editor';
import "./index.css";
import './worker';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  }, {
    path: "/hack",
    element: <Editor />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
