import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './root';
import Create from './routes/create';
import Edit from './routes/edit';
import Login from './routes/login';
import Core from './routes/core';
import EditContext from './routes/edit/context';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/guide/introduction" />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'new',
        element: <Create />,
      },
      {
        path: 'online/context',
        element: <EditContext />
      },
      {
        path: 'core/*',
        element: <Core />
      },
      {
        path: '*',
        element: <Edit />,
      },
    ],
  },
]);