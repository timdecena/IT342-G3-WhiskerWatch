import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/AdoptionForm.css";

function AdoptionForm() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const adopterId = 1; // Temporary: Replace with real user session

  const [form, setForm] = useState({
    adopterName: "",
    adopterContact: "",
    messageToOwner: "",
  });

  const [pet, setPet] = useState(null); // New state to hold pet details

  useEffect(() => {
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
      await axios.post(
        `http://localhost:8080/api/adoptions/request/${petId}/${adopterId}`,
        form
      );
      alert("Adoption request submitted successfully!");
      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.message || "Error submitting adoption request"
      );
      console.error(err);
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
