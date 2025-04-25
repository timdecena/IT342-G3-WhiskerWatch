import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/petdetails.css";

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/pets/${id}`)
      .then((res) => {
        setPet(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch pet:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="skeleton-wrapper">
        <div className="skeleton-card" />
      </div>
    );
  }

  if (!pet) {
    return <div className="pet-details-error">Pet not found or failed to load.</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="pet-details-container">
        <div className="pet-details-card">
          <div className="pet-image-container">
            <img
              src={pet.image || "/default-pet.jpg"}
              alt={pet.petName}
              className="pet-image"
            />
          </div>
          <div className="pet-info-container">
            <h1 className="pet-name">{pet.petName}</h1>
            <div className="pet-details-grid">
              <div className="detail-item">
                <span className="detail-icon">🐶</span>
                <span className="detail-label">Breed:</span>
                <span className="detail-value">{pet.breed}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🎂</span>
                <span className="detail-label">Age:</span>
                <span className="detail-value">{pet.age}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🧬</span>
                <span className="detail-label">Species:</span>
                <span className="detail-value">{pet.species}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">💊</span>
                <span className="detail-label">Status:</span>
                <span className={`detail-value status-${pet.status.toLowerCase()}`}>
                  {pet.status}
                </span>
              </div>
            </div>
            <button className="adopt-button" onClick={() => navigate(`/adopt/${id}`)}>
              Submit Adoption Form
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="faq-heading">Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3 className="faq-question">What is the adoption process like?</h3>
          <p className="faq-answer">
            After you fill out the adoption form, our team will review your application within 24–48 hours.
            You’ll be contacted for a short interview before the adoption is finalized.
          </p>
        </div>
        <div className="faq-item">
          <h3 className="faq-question">Are the pets vaccinated and neutered?</h3>
          <p className="faq-answer">
            Yes, all our pets are vaccinated, dewormed, and neutered before they are put up for adoption.
          </p>
        </div>
        <div className="faq-item">
          <h3 className="faq-question">Can I return a pet if it doesn't work out?</h3>
          <p className="faq-answer">
            Absolutely. We offer a 14-day return period and provide support to help you transition your pet back safely.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PetDetails;
