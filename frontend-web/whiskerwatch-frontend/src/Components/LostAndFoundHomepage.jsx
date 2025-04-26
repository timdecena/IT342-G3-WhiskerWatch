import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../assets/LostAndFoundHomepage.module.css";
import bannerPets from "../assets/cat-hero1.png";

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
    <div className={styles.homepage}>
      <header className={styles["homepage-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["hero-text"]}>
            <h1 className={styles["main-title"]}>
              Lost & Found <span className={styles["highlight-text"]}>Pets</span>
            </h1>
            <p className={styles["subtext"]}>
              Help reunite lost pets with their owners or give a new life to found friends.
            </p>
            <div className={styles["search-container"]}>
              <select
                className={styles["category-dropdown"]}
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
                className={styles["search-bar"]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link to="/post-lost-pet" className={styles["post-pet-btn1"]}>
                Report a Lost or Found Pet
              </Link>
            </div>
          </div>

          <div className={styles["hero-image"]}>
            <img src={bannerPets} alt="Lost and Found Pets" className={styles["hero-image"]} />
          </div>
        </div>
      </header>

      <main className={styles["main-content"]}>
        <section className={styles["pets-section"]} ref={petsSectionRef}>
          <h2 className={styles["section-title"]}>Lost Pets</h2>

          <div className={styles["pet-grid"]}>
            {filteredLostPets.length > 0 ? (
              filteredLostPets.map((pet) => (
                <Link
                  to={`/lost-and-found/${pet.id}`}
                  key={pet.id}
                  className={styles["pet-card-link"]}
                >
                  <div className={styles["pet-card"]}>
                    <div className={styles["pet-image-container"]}>
                      {pet.image ? (
                        <img
                          src={`http://localhost:8080/files/${pet.image}`}
                          alt={pet.petName}
                          className={styles["pet-image"]}
                        />
                      ) : (
                        <div className={styles["pet-image"]}>No Image</div>
                      )}
                    </div>
                    <div className={styles["pet-details"]}>
                      <h3>{pet.petName}</h3>
                      <p><strong>Species:</strong> {pet.species || "Unknown"}</p>
                      <p><strong>Location:</strong> {pet.location || `${pet.country || ''}, ${pet.city || ''}, ${pet.barangay || ''}`}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className={styles["no-pets-message"]}>No lost pets found.</p>
            )}
          </div>

          <h2 className={styles["section-title"]} style={{ marginTop: "5rem" }}>Found Pets</h2>

          <div className={styles["pet-grid"]}>
            {filteredFoundPets.length > 0 ? (
              filteredFoundPets.map((pet) => (
                <Link
                  to={`/lost-and-found/${pet.id}`}
                  key={pet.id}
                  className={styles["pet-card-link"]}
                >
                  <div className={styles["pet-card"]}>
                    <div className={styles["pet-image-container"]}>
                      {pet.image ? (
                        <img
                          src={`http://localhost:8080/files/${pet.image}`}
                          alt={pet.petName}
                          className={styles["pet-image"]}
                        />
                      ) : (
                        <div className={styles["pet-image"]}>No Image</div>
                      )}
                    </div>
                    <div className={styles["pet-details"]}>
                      <h3>{pet.petName}</h3>
                      <p><strong>Species:</strong> {pet.species || "Unknown"}</p>
                      <p><strong>Location:</strong> {pet.location || `${pet.country || ''}, ${pet.city || ''}, ${pet.barangay || ''}`}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className={styles["no-pets-message"]}>No found pets listed yet.</p>
            )}
          </div>
        </section>
      </main>

      <div className={styles["post-pet-link"]}>
        <Link to="/post-lost-pet" className={styles["post-pet-btn1"]}>
          Report a Lost or Found Pet
        </Link>
      </div>
    </div>
  );
}

export default LostAndFoundHomepage;