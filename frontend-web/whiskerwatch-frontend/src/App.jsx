import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Homepage from './Components/Homepage';
import PostPets from './Components/PostPets';
import Header from './Components/Header'; // Ensure Header is imported if not already
import PetDetails from "./Components/PetDetails";
import AdoptionForm from "./Components/AdoptionForm";
import AdoptionRequestDetail from "./Components/AdoptionRequestDetail";
import About from './Components/about'; // Import the About page component
import Contact from './Components/contact'; // Import the About page component
import YourListing from "./components/YourListing"; 
import UpdatePet from './Components/UpdatePet';

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

        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/adopt/:petId" element={<AdoptionForm />} />
        <Route path="/adoption-request/:requestId" element={<AdoptionRequestDetail />} />
        <Route path="/about" element={<About />} /> {/* The About Page Route */}
        <Route path="/contact" element={<Contact />} /> {/* The contact Page Route */}
        <Route path="/your-listing" element={<YourListing />} />
        <Route path="/update-pet/:id" element={<UpdatePet />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
