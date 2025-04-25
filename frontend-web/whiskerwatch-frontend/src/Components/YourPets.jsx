// src/pages/YourPets.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/homepage.css"; // Optional: reuse styling
import { Link } from "react-router-dom";

function YourPets({ user }) {
  const [yourPets, setYourPets] = useState([]);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:8080/api/pets/user/${user.id}`)
      .then((res) => setYourPets(res.data))
      .catch((err) => console.error("Error fetching user's pets:", err));
  }, [user]);

  return (
    <div className="main-content">
      <h2 className="section-title">Your Pet Listings</h2>

      {yourPets.length > 0 ? (
        <div className="pet-grid">
          {yourPets.map((pet) => (
            <Link to={`/pets/${pet.id}`} key={pet.id} className="pet-card-link">
              <div className="pet-card">
                <div className="pet-image-container">
                  <img
                    src={`http://localhost:8080/files/${pet.image}`}
                    alt={pet.petName}
                    className="pet-image"
                  />
                </div>
                <div className="pet-details">
                  <h3>{pet.petName}</h3>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age} years</p>
                  <p><strong>Status:</strong> {pet.status}</p>
                  <p><strong>Species:</strong> {pet.species}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-pets-message">You have no pets listed yet.</p>
      )}
    </div>
  );
}

export default YourPets;
