import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/AdoptionForm.css";

function AdoptionForm() {
  const { petId } = useParams();
  const navigate = useNavigate();

  // Get the token from localStorage and decode it to extract the user info (adopter)
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in to adopt a pet.");
    navigate("/login");
    return;
  }

  // Decode the JWT token to get adopter's info (adopter ID should be a number)
  const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
  const adopterId = decodedToken.sub; // Assuming 'sub' contains the user ID (Long)
  
  if (!adopterId) {
    alert("User ID is missing in the token.");
    navigate("/login");
    return;
  }

  const [form, setForm] = useState({
    adopterName: "",
    adopterContact: "",
    messageToOwner: "",
  });

  const [pet, setPet] = useState(null); // New state to hold pet details

  useEffect(() => {
    // Fetch pet details by petId
    axios.get(`http://localhost:8080/api/pets/${petId}`)
      .then(res => setPet(res.data))
      .catch(err => console.error("Failed to fetch pet:", err));
  }, [petId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8080/api/adoptions/request/${petId}/${adopterId}`,
        form, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      alert("Adoption request submitted successfully!");
      navigate("/"); // Navigate back to homepage or adoption confirmation page
    } catch (err) {
      // Improved error handling
      const errorMessage = err.response?.data?.message || "Error submitting adoption request";
      alert(errorMessage);
      console.error("Error details:", err.response?.data || err);
    }
  };

  return (
    <div className="adoption-form-container">
      <h2>
        {pet ? `You are adopting ${pet.petName}` : "Loading pet info..."}
      </h2>

      <form onSubmit={handleSubmit}>
        <label>
          Your Full Name:
          <input
            type="text"
            name="adopterName"
            value={form.adopterName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contact Info:
          <input
            type="text"
            name="adopterContact"
            value={form.adopterContact}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Message to Pet Owner:
          <textarea
            name="messageToOwner"
            value={form.messageToOwner}
            onChange={handleChange}
            rows="4"
          />
        </label>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default AdoptionForm;
