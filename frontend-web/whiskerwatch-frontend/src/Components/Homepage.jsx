import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../assets/homepage.css";
import bannerPets from "../assets/cat-hero1.png";

function Homepage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const petsSectionRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/pets")
      .then((response) => setPets(response.data))
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  const normalizeSpecies = (species) => {
    return species ? species.toLowerCase().replace(/s$/, "") : "";
  };

  const filteredPets = pets.filter((pet) => {
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

  const userId = localStorage.getItem("userId");

  // Filter pets created by this user
  const yourPets = filteredPets.filter(
    (pet) => pet.owner && pet.owner.id == userId
  );
  const otherPets = filteredPets.filter(
    (pet) => !pet.owner || pet.owner.id != userId
  );

  // Combine them, yours first
  const sortedPets = [...yourPets, ...otherPets];

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-content">
          <div className="hero-text">
            <h1 className="main-title">
              Every Pet Deserves a Loving Home.
              <br />
              <span className="highlight-text">Adopt a Pet Today</span>
            </h1>
            <p className="subtext">
              Browse our available animals and learn more about the adoption
              process. Together, we can rescue, rehabilitate, and rehome pets in
              need.
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
                placeholder="Search pets..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link to="/post-pets" className="post-pet-btn1">
                List a Pet for Adoption
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img src={bannerPets} alt="Adopt pets" className="hero-image" />
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="pets-section" ref={petsSectionRef}>
          <h2 className="section-title">Available Pets</h2>

          <div className="pet-grid">
            {sortedPets.length > 0 ? (
              sortedPets.map((pet) => {
                const isYours = pet.owner && pet.owner.id == userId;

                const PetCardContent = (
                  <div className={`pet-card ${isYours ? "your-pet" : ""}`}>
                    <div className="pet-image-container">
                      <img
                        src={`http://localhost:8080/files/${pet.image}`}
                        alt={pet.petName}
                        className="pet-image"
                      />
                    </div>
                    <div className="pet-details">
                      <h3>
                        {pet.petName}{" "}
                        {isYours && (
                          <span className="yours-label">Yours</span>
                        )}
                      </h3>
                      <p>
                        <strong>Breed:</strong> {pet.breed}
                      </p>
                      <p>
                        <strong>Age:</strong> {pet.age} years
                      </p>
                      <p>
                        <strong>Status:</strong> {pet.status}
                      </p>
                      <p>
                        <strong>Species:</strong> {pet.species}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {pet.location ||
                          `${pet.country || ""}, ${pet.city || ""}, ${
                            pet.barangay || ""
                          }`}
                      </p>
                    </div>
                  </div>
                );

                return isYours ? (
                  <div key={pet.id} className="pet-card-wrapper not-clickable">
                    {PetCardContent}
                  </div>
                ) : (
                  <Link
                    to={`/pets/${pet.id}`}
                    key={pet.id}
                    className="pet-card-link"
                  >
                    {PetCardContent}
                  </Link>
                );
              })
            ) : (
              <p className="no-pets-message">
                No pets available matching your criteria.
              </p>
            )}
          </div>
        </section>
      </main>

      <div className="post-pet-link">
        <Link to="/post-pets" className="post-pet-btn">
          List a Pet for Adoption
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
