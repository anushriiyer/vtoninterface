import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import TryOnPage from './TryOnPage';
import UserImage from './UserImage';
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/try-on" element={<TryOnPage />} />
        <Route path="/user-image" element={<UserImage/>}/>
      </Routes>
    </Router>
  );
}

export default App;