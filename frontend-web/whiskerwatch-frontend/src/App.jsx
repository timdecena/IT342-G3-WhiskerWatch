import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Homepage from './Components/Homepage';
import PostPets from './Components/PostPets';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to /homepage if authenticated, otherwise show login */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/homepage" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (Require Authentication) */}
        <Route 
          path="/homepage" 
          element={isAuthenticated ? <Homepage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/post-pets" 
          element={isAuthenticated ? <PostPets /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
