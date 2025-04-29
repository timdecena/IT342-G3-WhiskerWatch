import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/Register.css';

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleRegister = async () => {
        const response = await fetch('api/users/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
  
      if (response.ok) {
        alert('Registration successful. Please login.');
        navigate('/');
      } else {
        alert('Registration failed');
      }
    };
  
    return (
      <div>
        <h1>Register</h1>
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Sign Up</button>
        <p>Already have an account? <a href="/">Login</a></p>
      </div>
    );
  }

export default Register;