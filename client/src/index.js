import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainPage from './pages/MainPage';
import RoadMap from './pages/RoadMap';
import PageNotFound from './pages/PageNotFound';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/map/:mapId" element={<RoadMap />} />
        <Route path="*" element={<PageNotFound />}/>
      </Routes>
    </BrowserRouter>
);