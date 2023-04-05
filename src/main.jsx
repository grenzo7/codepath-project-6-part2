import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import CardLayout from './CardLayout';
import ChartLayout from './ChartLayout';
import MoreAlbumInfo from "./MoreAlbumInfo";
import NoPage from './components/NoPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index={true} element={<CardLayout />} />
        <Route path="/chartview" element={<ChartLayout />} />
        <Route path="/albums/:albumID" element={<MoreAlbumInfo />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
