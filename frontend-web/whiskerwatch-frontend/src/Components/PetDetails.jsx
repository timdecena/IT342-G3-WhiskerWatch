import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/pets/${id}`)
      .then(res => setPet(res.data))
      .catch(err => console.error("Failed to fetch pet:", err));
  }, [id]);

  if (!pet) return <div>Loading...</div>;

  return (
    <div className="pet-details">
      <h2>{pet.petName}</h2>
      <img src={pet.image || "/default-pet.jpg"} alt={pet.petName} />
      <p><strong>Breed:</strong> {pet.breed}</p>
      <p><strong>Age:</strong> {pet.age}</p>
      <p><strong>Status:</strong> {pet.status}</p>
      <p><strong>Species:</strong> {pet.species}</p>

      <button onClick={() => navigate(`/adopt/${id}`)}>
        Submit Adoption Form
      </button>
    </div>
  );
}

export default PetDetails;
