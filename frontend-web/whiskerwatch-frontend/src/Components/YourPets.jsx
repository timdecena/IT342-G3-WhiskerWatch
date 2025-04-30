import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../assets/homepage.css";
import "../assets/yourpets.css";
import BASE_URL from '../Components/Config'; 
const YourPets = () => {
  const [allPets, setAllPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [deletedPetIds, setDeletedPetIds] = useState(
    JSON.parse(localStorage.getItem("deletedPetIds") || "[]")
  );

  useEffect(() => {
    const fetchAllUserPets = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage.");
          return;
        }

        const [adoptionRes, lostFoundRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/pets/owner/${userId}`),
          axios.get(`${BASE_URL}/api/lost-and-found/reporter/${userId}`)
        ]);

        const adoptionPets = adoptionRes.data.map(pet => ({
          ...pet,
          source: "Adoption"
        }));

        const lostFoundPets = lostFoundRes.data.map(pet => ({
          ...pet,
          source: "LostFound"
        }));

        console.log("LOST & FOUND pets fetched:", lostFoundPets);

        setAllPets([...adoptionPets, ...lostFoundPets]);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      }
    };

    fetchAllUserPets();
  }, []);

  const normalizeSpecies = (species) =>
    species ? species.toLowerCase().replace(/s$/, "") : "";

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (confirmed) {
      const updatedDeleted = [...deletedPetIds, id];
      setDeletedPetIds(updatedDeleted);
      localStorage.setItem("deletedPetIds", JSON.stringify(updatedDeleted));
    }
  };

  const filteredPets = allPets
    .filter((pet) => !deletedPetIds.includes(pet.id))
    .filter((pet) => {
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
        <select className="category-dropdown" value={category} onChange={(e) => setCategory(e.target.value)}>
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
            <div key={`${pet.source}-${pet.id}`} className="pet-card">
              <div className="pet-image-container">
                {pet.image ? (
                  <img
                    src={`${BASE_URL}/files/${pet.image}`}
                    alt={pet.petName}
                    className="pet-image"
                  />
                ) : (
                  <div className="pet-image">No Image</div>
                )}
              </div>
              <div className="pet-details">
                <h3>{pet.petName}</h3>
                {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
                {pet.age && <p><strong>Age:</strong> {pet.age} years</p>}
                <p><strong>Status:</strong> {pet.status}</p>
                <p><strong>Species:</strong> {pet.species}</p>
                <p><strong>Location:</strong> {
                  pet.location
                    ? pet.location
                    : [pet.barangay, pet.city, pet.country].filter(Boolean).join(', ')
                }</p>
                <p><strong>Listed For:</strong> {
                  pet.source === "Adoption" ? "Adoption" : pet.status
                }</p>
              </div>
              <div className="pet-actions">
                {pet.source === "Adoption" ? (
                  <Link to={`/edit-pet/${pet.id}`} className="edit-btn">Edit</Link>
                ) : (
                  <Link to={`/lost-and-found/${pet.id}`} className="edit-btn">View</Link>
                )}
                <button onClick={() => handleDelete(pet.id)} className="delete-btn">Delete</button>
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
