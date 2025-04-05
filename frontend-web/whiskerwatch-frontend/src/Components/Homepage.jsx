import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../assets/homepage.css";

function Homepage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/pets")
      .then((response) => setPets(response.data))
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  const filteredPets = pets.filter((pet) => {
    const petName = pet.petName || "";
    return (
      (category === "All" || pet.species === category) &&
      petName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1 className="main-title">
          Every Pet Deserves a Loving Home.
          <br />
          <span className="highlight-text">Adopt a Pet Today</span>
        </h1>

        <p className="subtext">
          Browse our available animals and learn more about the adoption process.
          Together, we can rescue, rehabilitate, and rehome pets in need.
        </p>

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
            placeholder="Search pets..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          
        </div>
      </header>

      <main className="main-content">
        <section className="pets-section">
          <h2 className="section-title">Available Pets</h2>

          <div className="pet-grid">
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <div key={pet.id} className="pet-card">
                  <div className="pet-image-container">
                    <img
                      src={pet.image || "/default-pet-image.jpg"}
                      alt={pet.petName}
                      className="pet-image"
                    />
                  </div>

                  <div className="pet-details">
                    <h3>{pet.petName}</h3>
                    <p>Breed: {pet.breed}</p>
                    <p>Age: {pet.age} years</p>
                    <p>Status: {pet.status}</p>
                  </div>
                </div>
              ))
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
          Post a Pet
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
