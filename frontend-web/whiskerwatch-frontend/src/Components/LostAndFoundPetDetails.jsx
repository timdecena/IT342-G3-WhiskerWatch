import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/LostAndFoundPetDetails.css";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

function LostAndFoundPetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as", // Replace with your real key
  });

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "12px",
    marginTop: "10px",
  };

  useEffect(() => {
    axios
      .get(`http://ec2-35-168-15-40.compute-1.amazonaws.com:8080/api/lost-and-found/${id}`)
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
              src={
                pet.image
                  ? `http://ec2-35-168-15-40.compute-1.amazonaws.com:8080/files/${pet.image}`
                  : "/default-pet.jpg"
              }
              alt={pet.petName || "Pet Image"}
              className="pet-image"
            />
          </div>
          <div className="pet-info-container">
            <h1 className="pet-name">{pet.petName}</h1>
            <div className="pet-details-grid">
              <div className="detail-item">
                <span className="detail-icon">🔍</span>
                <span className="detail-label">Status:</span>
                <span className={`detail-value status-${pet.status?.toLowerCase()}`}>
                  {pet.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🐾</span>
                <span className="detail-label">Species:</span>
                <span className="detail-value">{pet.species || "Unknown"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span className="detail-label">Reported:</span>
                <span className="detail-value">
                  {pet.reportedDate ? new Date(pet.reportedDate).toLocaleDateString() : "Unknown"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-label">Location:</span>
                <div className="detail-value location-details">
                  {pet.barangay && <span>{pet.barangay}, </span>}
                  {pet.city && <span>{pet.city}, </span>}
                  {pet.country && <span>{pet.country}</span>}
                </div>
              </div>
              {pet.description && (
                <div className="detail-item full-width">
                  <span className="detail-icon">📝</span>
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{pet.description}</span>
                </div>
              )}
            </div>

            {pet.latitude && pet.longitude && isLoaded && (
              <div className="map-container">
                <h3 className="map-title">Last Seen Location</h3>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={{ lat: pet.latitude, lng: pet.longitude }}
                  zoom={14}
                >
                  <Marker position={{ lat: pet.latitude, lng: pet.longitude }} />
                </GoogleMap>
              </div>
            )}

            {pet.reporter?.id && (
              <button
                className="contact-button"
                onClick={() => navigate(`/messages/${pet.reporter.id}`)}
              >
                Message Reporter
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2 className="faq-heading">What to Do</h2>
        <div className="faq-item">
          <h3 className="faq-question">
            {pet.status === "LOST" ? "Have you seen this pet?" : "Is this your pet?"}
          </h3>
          <p className="faq-answer">
            {pet.status === "LOST"
              ? "If you've seen this pet, please contact the reporter with any information that might help reunite them."
              : "If this pet belongs to you, please contact the reporter to arrange for reunion."}
          </p>
        </div>
        <div className="faq-item">
          <h3 className="faq-question">How can I help?</h3>
          <p className="faq-answer">
            Share this post on social media to increase visibility. The more people who see this,
            the better chance of {pet.status === "LOST" ? "finding" : "reuniting"} this pet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LostAndFoundPetDetails;
