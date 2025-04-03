import Layout from "../Components/Layout";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../assets/homepage.css";

function Homepage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");

    setFirstName(storedFirstName || "");
    setLastName(storedLastName || "");

    axios
      .get("http://localhost:8080/api/pets")
      .then((response) => {
        setPets(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the pets:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <Layout>
      <div className="homepage">
        <header className="homepage-header">
          <h1 className="welcome-text">Welcome to WhiskerWatch</h1>
          {firstName && lastName ? (
            <h2 className="greeting">Hello, {firstName} {lastName}!</h2>
          ) : (
            <h2 className="greeting">Welcome, Guest!</h2>
          )}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </header>

        <section className="pets-section">
          <h3 className="section-title">Our Pets:</h3>
          <div className="pet-grid">
            {pets.length > 0 ? (
              pets.map(pet => (
                <div key={pet.id} className="pet-card">
                  <img 
                    src={pet.image || "/default-pet-image.jpg"}  
                    alt={pet.petName} 
                    className="pet-image" 
                  />
                  <div className="pet-details">
                    <h4>{pet.petName}</h4>
                    <p>Species: {pet.species}</p>
                    <p>Breed: {pet.breed}</p>
                    <p>Age: {pet.age}</p>
                    <p>Status: {pet.status}</p>
                    {pet.owner && (
                      <p>Owner: {pet.owner.firstName} {pet.owner.lastName}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No pets available.</p>
            )}
          </div>
        </section>

        <div className="post-pet-link">
          <Link to="/post-pets">
            <button className="post-pet-btn">Post a Pet</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Homepage;
