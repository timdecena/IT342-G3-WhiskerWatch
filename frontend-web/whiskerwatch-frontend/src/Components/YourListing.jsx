import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // For navigation
import "../assets/yourlisting.css";

function YourListing() {
  const [pets, setPets] = useState([]);
  const userId = localStorage.getItem("userId"); // Ensure this is set on login

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8080/api/pets/owner/${userId}`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("Error fetching your pets:", err));
  }, [userId]);

  return (
    <div className="yourlisting-container">
      <h2 className="yourlisting-title">Your Listed Pets</h2>
      <div className="pet-grid">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div className="pet-card" key={pet.id}>
              <div className="pet-image-container">
                <img
                  src={`http://localhost:8080/files/${pet.image}`}
                  alt={pet.petName}
                  className="pet-image"
                />
              </div>
              <div className="pet-details">
                <h3>{pet.petName}</h3>
                <p><strong>Type:</strong> {pet.type}</p>
                <p><strong>Species:</strong> {pet.species}</p>
                <p><strong>Breed:</strong> {pet.breed}</p>
                <p><strong>Age:</strong> {pet.age}</p>
                <p><strong>Status:</strong> {pet.status}</p>
                <p><strong>Location:</strong> {pet.barangay}, {pet.city}, {pet.country}</p>
              </div>

              {/* Update Button */}
              <Link to={`/update-pet/${pet.id}`} className="update-pet-btn">
                Update
              </Link>
            </div>
          ))
        ) : (
          <p className="no-pets-message">You haven't listed any pets yet.</p>
        )}
      </div>
    </div>
  );
}

export default YourListing;
