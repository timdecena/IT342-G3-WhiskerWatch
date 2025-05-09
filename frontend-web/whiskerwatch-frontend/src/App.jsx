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
import YourPets from './Components/YourPets';
import EditPet from './Components/EditPet'; // Import the EditPet component
import LostAndFoundHomepage from './Components/LostAndFoundHomepage'; 
import PostLostPet from './Components/PostLostPet'; 
import LostAndFoundPetDetails from './Components/LostAndFoundPetDetails';
import MessageConversation from './Components/MessageConversation';
import MessageList from './Components/MessageList';
import UserProfile from './Components/UserProfile';
import Profile from './Components/Profile';
import Developers from './Components/Developers';


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
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />} 
        />
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
        <Route path="/developers" element={<Developers />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/adopt/:petId" element={<AdoptionForm />} />
        <Route path="/adoption-request/:requestId" element={<AdoptionRequestDetail />} />
        <Route path="/about" element={<About />} /> {/* The About Page Route */}
        <Route path="/yourpets" element={isAuthenticated ? <YourPets /> : <Navigate to="/" replace />} />
        <Route path="/lost-and-found" element={<LostAndFoundHomepage />} />
        <Route path="/post-lost-pet" element={<PostLostPet />} />
        {/* Route for editing pet */}
        // In your main router configuration
        <Route path="/messages" element={<MessageList />} />
        <Route path="/messages/:userId" element={<MessageConversation />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lost-and-found/:id" element={<LostAndFoundPetDetails />} />
        <Route path="/edit-pet/:id" element={isAuthenticated ? <EditPet /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
