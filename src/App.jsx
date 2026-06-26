import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Site from './Site';
import Admin from './Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
