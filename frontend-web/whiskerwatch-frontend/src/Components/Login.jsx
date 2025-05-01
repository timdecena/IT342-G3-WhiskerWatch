import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Login.css';
import BASE_URL from '../Components/Config'; 

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.firstName && data.lastName && data.userId) {
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        navigate('/homepage');
      } else {
        console.error("Missing user data in response.");
      }
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand-name">WhiskerWatch</div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtext">Log in to manage your pets, track adoptions, report lost or found pets, and connect with others.</p>

        <div className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-btn" onClick={handleLogin}>Sign In</button>
          <p className="signup-link">
            Don’t have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="hero-message">
          <h2>What is <span className="highlight">WhiskerWatch</span>?</h2>
          <p>
            WhiskerWatch is a modern pet adoption system that helps connect people with animals in need. 
            Whether you’re looking to adopt, rehome, or report a lost or found pet, 
            WhiskerWatch makes it seamless with real-time listings, adoption forms, and messaging tools to connect with fellow users.
          </p>
          <ul>
            <li>🐾 Post pets for adoption</li>
            <li>🔍 Track and manage adoption forms</li>
            <li>📍 Report lost or found pets in your community</li>
            <li>💬 Message other users and build connections</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
