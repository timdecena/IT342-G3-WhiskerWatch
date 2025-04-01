import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log("API Response:", data);  // Debugging API response
  
      if (data.firstName && data.lastName) { // Ensure values exist
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
      } else {
        console.error("Missing firstName or lastName in response.");
      }
  
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      navigate('/homepage');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Sign In</button>
      <p>Don't have an account? <a href="/register">Sign up</a></p>
    </div>
  );
}

export default Login;
