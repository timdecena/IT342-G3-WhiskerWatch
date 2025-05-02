import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/Login.css';
import BASE_URL from '../Components/Config';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { firstName, lastName, userId, token } = data;
        if (firstName && lastName && userId) {
          localStorage.setItem('firstName', firstName);
          localStorage.setItem('lastName', lastName);
          localStorage.setItem('userId', userId);
          localStorage.setItem('token', token);
          setIsAuthenticated(true);
          navigate('/homepage');
        } else {
          console.error("Missing user data in response.");
        }
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand-name">🐶 WhiskerWatch</div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtext">
          Log in to manage your pets, track adoptions, report lost or found pets, and connect with the community.
        </p>

        <div className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email Address"
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          <button className="login-btn" onClick={handleLogin}>
            Sign In
          </button>
          <p className="signup-link">
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="hero-message">
          <h2>What is <span className="highlight">WhiskerWatch</span>?</h2>
          <p>
            WhiskerWatch is your digital companion for all things pet-related.
            Whether you're looking to adopt, rehome, or protect lost animals,
            our platform connects you to a supportive and caring community.
          </p>

          <ul className="features">
            <li>🐾 Post pets for adoption</li>
            <li>🔍 Track and manage adoption forms</li>
            <li>📍 Report lost or found pets</li>
            <li>💬 Message other pet lovers in real-time</li>
          </ul>
        </div>

        <div className="testimonial-section">
          <h3>What our users say</h3>
          <blockquote>
            “I found my lost cat in under 24 hours thanks to WhiskerWatch. An absolute lifesaver!” – <span className="testimonial-author">Emily R.</span>
          </blockquote>
        </div>

        <div className="cta-box">
          <h4>New to WhiskerWatch?</h4>
          <p>Sign up now and become part of our caring pet community.</p>
          <Link to="/register" className="cta-btn">Create Account</Link>
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
  <Link to="/developers" className="cta-btn">Meet the Developers</Link>


</div>
      </div>
    </div>
  );
}

export default Login;
