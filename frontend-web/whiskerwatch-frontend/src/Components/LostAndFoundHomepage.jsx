// src/pages/LostAndFoundHomepage.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../assets/homepage.css"; // ✅ Reusing your existing style
import bannerPets from "../assets/cat-hero1.png"; // ✅ Your banner image

function LostAndFoundHomepage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const petsSectionRef = useRef(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/lost-and-found");
      setPets(response.data);
    } catch (error) {
      console.error("Error fetching lost and found pets:", error);
    }
  };

  const normalizeSpecies = (species) => {
    return species ? species.toLowerCase().replace(/s$/, "") : "";
  };

  const filteredLostPets = pets
    .filter((pet) => pet.status.toUpperCase() === "LOST")
    .filter((pet) => {
      const petName = pet.petName || "";
      const petSpecies = normalizeSpecies(pet.species);
      const selectedCategory = normalizeSpecies(category);

      return (
        (selectedCategory === "all" || petSpecies === selectedCategory) &&
        petName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const filteredFoundPets = pets
    .filter((pet) => pet.status.toUpperCase() === "FOUND")
    .filter((pet) => {
      const petName = pet.petName || "";
      const petSpecies = normalizeSpecies(pet.species);
      const selectedCategory = normalizeSpecies(category);

      return (
        (selectedCategory === "all" || petSpecies === selectedCategory) &&
        petName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    if (e.target.value !== "All") {
      petsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-content">
          <div className="hero-text">
            <h1 className="main-title">
              Lost & Found <span className="highlight-text">Pets</span>
            </h1>
            <p className="subtext">
              Help reunite lost pets with their owners or give a new life to found friends.
            </p>
            <div className="search-container">
              <select
                className="category-dropdown"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="All">All Pets</option>
                <option value="Dogs">Dogs</option>
                <option value="Cats">Cats</option>
              </select>
              <input
                type="text"
                placeholder="  Search pets..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link to="/post-lost-pet" className="post-pet-btn1">
                Report a Lost or Found Pet
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img src={bannerPets} alt="Lost and Found Pets" className="hero-image" />
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="pets-section" ref={petsSectionRef}>
          <h2 className="section-title">Lost Pets</h2>

          <div className="pet-grid">
            {filteredLostPets.length > 0 ? (
              filteredLostPets.map((pet) => (
                <Link
                  to={`/lost-and-found/${pet.id}`}
                  key={pet.id}
                  className="pet-card-link"
                >
                  <div className="pet-card">
                    <div className="pet-image-container">
                      {pet.image ? (
                        <img
                          src={`http://localhost:8080/files/${pet.image}`}
                          alt={pet.petName}
                          className="pet-image"
                        />
                      ) : (
                        <div className="pet-image">No Image</div>
                      )}
                    </div>
                    <div className="pet-details">
                      <h3>{pet.petName}</h3>
                      <p><strong>Species:</strong> {pet.species || "Unknown"}</p>
                      <p><strong>Location:</strong> {pet.location || `${pet.country || ''}, ${pet.city || ''}, ${pet.barangay || ''}`}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-pets-message">No lost pets found.</p>
            )}
          </div>

          <h2 className="section-title" style={{ marginTop: "5rem" }}>Found Pets</h2>

          <div className="pet-grid">
            {filteredFoundPets.length > 0 ? (
              filteredFoundPets.map((pet) => (
                <Link
                  to={`/lost-and-found/${pet.id}`}
                  key={pet.id}
                  className="pet-card-link"
                >
                  <div className="pet-card">
                    <div className="pet-image-container">
                      {pet.image ? (
                        <img
                          src={`http://localhost:8080/files/${pet.image}`}
                          alt={pet.petName}
                          className="pet-image"
                        />
                      ) : (
                        <div className="pet-image">No Image</div>
                      )}
                    </div>
                    <div className="pet-details">
                      <h3>{pet.petName}</h3>
                      <p><strong>Species:</strong> {pet.species || "Unknown"}</p>
                      <p><strong>Location:</strong> {pet.location || `${pet.country || ''}, ${pet.city || ''}, ${pet.barangay || ''}`}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-pets-message">No found pets listed yet.</p>
            )}
          </div>
        </section>
      </main>

      <div className="post-pet-link">
        <Link to="/post-lost-pet" className="post-pet-btn1">
          Report a Lost or Found Pet
        </Link>
      </div>
    </div>
  );
}

export default LostAndFoundHomepage;
