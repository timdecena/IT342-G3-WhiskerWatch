import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Components/Login';
import Register from './Components/Register';
import Homepage from './Components/Homepage';
import PostPets from './Components/PostPets';
import Header from './Components/Header';
import PetDetails from './Components/PetDetails';
import AdoptionForm from './Components/AdoptionForm';
import AdoptionRequestDetail from './Components/AdoptionRequestDetail';
import About from './Components/About';
import Contact from './Components/Contact';
import YourPets from './Components/YourPets';
import EditPet from './Components/EditPet';
import MessageConversation from './Components/MessageConversation';
import MessageList from './Components/MessageList';
import PostLostPet from './Components/PostLostPet';
import LostAndFoundHomepage from './Components/LostAndFoundHomepage';
import LostAndFoundPetDetails from './Components/LostAndFoundPetDetails';
import GoogleMapWrapper from './Components/GoogleMapWrapper';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

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
    <Router>
      {/* Show Header only when authenticated */}
      {isAuthenticated && <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}

      <Routes>
  {/* Authentication Routes */}
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
  <Route
    path="/yourpets"
    element={isAuthenticated ? <YourPets /> : <Navigate to="/" replace />}
  />
  <Route
    path="/edit-pet/:id"
    element={isAuthenticated ? <EditPet /> : <Navigate to="/" replace />}
  />
  <Route path="/post-lost-pet" element={isAuthenticated ? <PostLostPet /> : <Navigate to="/" replace />} />

  {/* Public Routes */}
  <Route path="/pets/:id" element={<PetDetails />} />
  <Route path="/adopt/:petId" element={<AdoptionForm />} />
  <Route path="/adoption-request/:requestId" element={<AdoptionRequestDetail />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/messages" element={<MessageList />} />
  <Route path="/messages/:userId" element={<MessageConversation />} />

  {/* Lost and Found Pages */}
  <Route path="/lost-and-found" element={<LostAndFoundHomepage />} />
  <Route 
    path="/lost-and-found/:id" 
    element={<LostAndFoundPetDetails />} 
  />
</Routes>
    </Router>
  );
}

export default App;
