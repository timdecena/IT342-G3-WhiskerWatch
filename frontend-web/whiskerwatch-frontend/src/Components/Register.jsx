import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/register.css';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await fetch('http://localhost:8080/api/users/createUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    if (response.ok) {
      alert('Registration successful. Please login.');
      navigate('/');
    } else {
      alert('Registration failed. Please check your input.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="brand-name">WhiskerWatch</div>
        <h1 className="register-title">Create Your Account</h1>
        <p className="register-subtext">
          Sign up to start posting pets, reporting lost & found animals, and connecting with the community.
        </p>

        <div className="register-form">
          <input
            type="text"
            placeholder="First Name"
            className="register-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="register-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="register-btn" onClick={handleRegister}>Sign Up</button>
          <p className="login-link">
            Already have an account? <a href="/">Login</a>
          </p>
        </div>
      </div>

      <div className="register-right">
        <div className="hero-register-message">
          <h2>Welcome to <span className="highlight">WhiskerWatch</span></h2>
          <p>
            Our platform is dedicated to helping you connect with loving pets and responsible adopters.
            Post, find, or rehome pets effortlessly with tools tailored for responsible pet care.
          </p>
          <ul>
            <li>✅ Easy pet listing and adoption management</li>
            <li>📍 Lost & Found pet reporting</li>
            <li>💬 In-app user messaging system</li>
            <li>🔐 Secure, fast, and friendly experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;
