import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/homepage.css';

function Homepage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const storedFirstName = localStorage.getItem('firstName');
    const storedLastName = localStorage.getItem('lastName');
  
    console.log("Stored First Name:", storedFirstName);
    console.log("Stored Last Name:", storedLastName);
  
    setFirstName(storedFirstName || '');
    setLastName(storedLastName || '');
  }, []);
  const handleLogout = () => {
    localStorage.clear(); // Clears all stored data
    setIsAuthenticated(false); // Update authentication state
    navigate('/'); // Redirect to login page
  };

  return (
    <div>
      <h1>Welcome to WhiskerWatch</h1>
      {firstName && lastName ? (
        <h2>Hello, {firstName} {lastName}!</h2>
      ) : (
        <h2>Welcome, Guest!</h2>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Homepage;
