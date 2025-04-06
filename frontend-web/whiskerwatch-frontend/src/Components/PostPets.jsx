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
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMessage('User ID not found. Please log in again.');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8080/api/pets/add/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        }
      );
  
      setMessage('Pet added successfully!');
      setFormData({
        petName: '',
        species: '',
        breed: '',
        age: '',
        status: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add pet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-pets-wrapper">
      <div className="post-pets-container">
        <h2>Add a New Pet</h2>
        <form onSubmit={handleSubmit} className="post-pet-form-horizontal">

          <div className="form-row">
            <div className={`form-group ${focusedField === 'petName' ? 'focused' : ''}`}>
              <label>Pet Name</label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                onFocus={() => handleFocus('petName')}
                onBlur={handleBlur}
                required
              />
            </div>

            <div className={`form-group ${focusedField === 'species' ? 'focused' : ''}`}>
              <label>Species</label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                onFocus={() => handleFocus('species')}
                onBlur={handleBlur}
                required
              >
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${focusedField === 'breed' ? 'focused' : ''}`}>
              <label>Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                onFocus={() => handleFocus('breed')}
                onBlur={handleBlur}
                required
              />
            </div>

            <div className={`form-group ${focusedField === 'age' ? 'focused' : ''}`}>
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onFocus={() => handleFocus('age')}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${focusedField === 'status' ? 'focused' : ''}`}>
              <label>Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                onFocus={() => handleFocus('status')}
                onBlur={handleBlur}
                required
              />
            </div>


          </div>

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
    </div>
  );
}

export default PostPets;
