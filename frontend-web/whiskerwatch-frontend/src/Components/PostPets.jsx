import Layout from "../Components/Layout";  // Assuming Layout is already imported
import { useState } from 'react';
import axios from 'axios';
import '../assets/PostPets.css';

function PostPets() {
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [status, setStatus] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send as a plain JSON object
    const petData = {
      petName: petName,
      species: species,
      breed: breed,
      age: age,
      status: status,
      ownerId: ownerId
    };

    try {
      // Make the API request to your controller
      const response = await axios.post(
        `http://localhost:8080/api/pets/add/${ownerId}`,
        petData,  // Send data as JSON
        {
          headers: {
            'Content-Type': 'application/json', // Correct content type for JSON
          },
        }
      );
      setMessage('Pet added successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Failed to add pet. Please try again.');
      console.error('Error details:', error.response || error);
    }
  };

  return (
    <Layout>
      <div className="post-pets-container">
        <h2>Add a New Pet</h2>
        <form onSubmit={handleSubmit} className="post-pet-form">
          <div className="form-group">
            <label>Pet Name</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Species</label>
            <input
              type="text"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Breed</label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Owner ID</label>
            <input
              type="number"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Add Pet</button>
        </form>

        {message && <p className="status-message">{message}</p>}
      </div>
    </Layout>
  );
}

export default PostPets;
