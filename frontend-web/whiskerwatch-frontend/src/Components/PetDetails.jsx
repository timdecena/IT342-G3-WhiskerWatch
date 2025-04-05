import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/petdetails.css";

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/pets/${id}`)
      .then(res => setPet(res.data))
      .catch(err => console.error("Failed to fetch pet:", err));
  }, [id]);

  if (!pet) return <div className="loading">Fetching pet details...</div>;

  return (
    <div className="pet-details-page">
      <div className="pet-info-card">
        <img
          src={pet.image || "/default-pet.jpg"}
          alt={pet.petName}
          className="pet-detail-image"
        />

        <div className="pet-info-text">
          <h1 className="pet-name">{pet.petName}</h1>

          <ul className="pet-attributes">
            <li><span>Breed:</span> {pet.breed}</li>
            <li><span>Age:</span> {pet.age}</li>
            <li><span>Status:</span> {pet.status}</li>
            <li><span>Species:</span> {pet.species}</li>
          </ul>

          <button
            className="adopt-button"
            onClick={() => navigate(`/adopt/${id}`)}
          >
            Submit Adoption Form
          </button>
        </div>
      </div>
    </div>
  );
}

export default PetDetails;
