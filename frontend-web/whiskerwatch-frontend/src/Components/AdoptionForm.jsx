import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function AdoptionForm() {
  const { petId } = useParams();
  const navigate = useNavigate();

  // Temporary: Replace with real user session
  const adopterId = 1;

  const [form, setForm] = useState({
    adopterName: "",
    adopterContact: "",
    messageToOwner: "",
  });

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
      navigate("/"); // Redirect back to homepage or confirmation page
    } catch (err) {
      alert(
        err.response?.data?.message || "Error submitting adoption request"
      );
      console.error(err);
    }
  };

  return (
    <div className="adoption-form-container">
      <h2>Adopt This Pet</h2>
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
