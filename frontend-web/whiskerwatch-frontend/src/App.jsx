import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Homepage from './Components/Homepage';
import PostPets from './Components/PostPets';
import Header from './Components/Header'; // Ensure Header is imported if not already

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Function to update authentication state
  const updateAuthStatus = () => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  useEffect(() => {
    window.addEventListener('storage', updateAuthStatus);
    return () => {
      window.removeEventListener('storage', updateAuthStatus);
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Show Header only when authenticated */}
      {isAuthenticated && <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
      
      <Routes>
        {/* Redirect to homepage if logged in */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/homepage" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/homepage" replace /> : <Register setIsAuthenticated={setIsAuthenticated} />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/homepage" 
          element={isAuthenticated ? <Homepage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/post-pets" 
          element={isAuthenticated ? <PostPets /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
