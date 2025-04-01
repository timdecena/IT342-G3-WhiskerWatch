import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Homepage from './Components/Homepage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/homepage" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={isAuthenticated ? <Homepage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
