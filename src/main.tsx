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
import Header from './components/header';

registerNat();

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/:file?/*" element={<Editor />} />
    </Routes>
  </BrowserRouter>
);

