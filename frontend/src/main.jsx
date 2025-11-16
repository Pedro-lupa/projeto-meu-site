import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.jsx';
import GameDetailPage from './pages/GameDetailPage.jsx';
import BoardGamePage from './pages/BoardGamePage.jsx';
import BoardGameDetailPage from './pages/BoardGameDetailPage.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/games/:gameId",
    element: <GameDetailPage />,
  },
  {
    path: "/boardgames",
    element: <BoardGamePage />, 
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

