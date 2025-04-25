import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../assets/homepage.css"; // Reuse Homepage styles
import "../assets/yourpets.css"; // Optional: override if needed

const YourPets = () => {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage.");
          return;
        }

        const res = await axios.get(`http://localhost:8080/api/pets/owner/${userId}`);
        setPets(res.data);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      }
    };

    fetchUserPets();
  }, []);

  const normalizeSpecies = (species) =>
    species ? species.toLowerCase().replace(/s$/, "") : "";

  const filteredPets = pets.filter((pet) => {
    const petName = pet.petName || "";
    const petSpecies = normalizeSpecies(pet.species);
    const selectedCategory = normalizeSpecies(category);

    return (
      (selectedCategory === "all" || petSpecies === selectedCategory) &&
      petName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="your-pets-page">
      <h2 className="section-title">Your Pet Listings</h2>

      <div className="search-container">
        <select
          className="category-dropdown"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Pets</option>
          <option value="Dogs">Dogs</option>
          <option value="Cats">Cats</option>
        </select>

        <input
          type="text"
          placeholder="  Search your pets..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Link to="/post-pets" className="post-pet-btn1">
          List a New Pet
        </Link>
      </div>

      <div className="pet-grid">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <div key={pet.id} className="pet-card">
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
                <p><strong>Location:</strong> {pet.location || `${pet.country || ''}, ${pet.city || ''}, ${pet.barangay || ''}`}</p>
              </div>
              <div className="pet-actions">
                <Link to={`/edit-pet/${pet.id}`} className="edit-btn">Edit</Link>
              </div>
            </div>
          ))
        ) : (
          <p className="no-pets-message">You haven’t listed any pets yet.</p>
        )}
      </div>
    </div>
  );
};

export default YourPets;
