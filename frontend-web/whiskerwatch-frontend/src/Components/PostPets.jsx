import Layout from "../Components/Layout";
import { useState } from 'react';
import axios from 'axios';
import '../assets/PostPets.css';

function PostPets() {
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    age: '',
    status: '',
    ownerId: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        `http://localhost:8080/api/pets/add/${formData.ownerId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setMessage('Pet added successfully!');
      setFormData({
        petName: '',
        species: '',
        breed: '',
        age: '',
        status: '',
        ownerId: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add pet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
 
      <div className="post-pets-container">
        <h2>Add a New Pet</h2>
        <form onSubmit={handleSubmit} className="post-pet-form">
          {Object.entries(formData).map(([key, value]) => (
            <div 
              key={key} 
              className={`form-group ${focusedField === key ? 'focused' : ''}`}
            >
              <label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={key === 'age' || key === 'ownerId' ? 'number' : 'text'}
                name={key}
                value={value}
                onChange={handleChange}
                onFocus={() => handleFocus(key)}
                onBlur={handleBlur}
                required
              />
            </div>
          ))}

          <button 
            type="submit" 
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Add Pet'}
          </button>
        </form>

        {message && (
          <p className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>

  );
}

export default PostPets;