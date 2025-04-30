import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../assets/PetDetails.module.css"; // Import module CSS
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import BASE_URL from '../Components/Config'; 

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as",
  });

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "16px",
  };

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
      <div className={styles.skeletonWrapper}>
        <div className={styles.skeletonCard} />
      </div>
    );
  }

  if (!pet) {
    return <div>Pet not found or failed to load.</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.petDetailsContainer}>
        <div className={styles.petDetailsCard}>
          <div className={styles.cardTop}>
            <div className={styles.petImageContainer}>
              <img
                src={pet.image ? `${BASE_URL}/files/${pet.image}` : "/default-pet.jpg"}
                alt={pet.petName || "Pet Image"}
                className={styles.petImage}
              />
            </div>

            <div className={styles.petInfoContainer}>
              <h1 className={styles.petName}>{pet.petName}</h1>
              <div className={styles.petDetailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🐶</span>
                  <span className={styles.detailLabel}>Breed:</span>
                  <span className={styles.detailValue}>{pet.breed}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🎂</span>
                  <span className={styles.detailLabel}>Age:</span>
                  <span className={styles.detailValue}>{pet.age}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🧬</span>
                  <span className={styles.detailLabel}>Species:</span>
                  <span className={styles.detailValue}>{pet.species}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>💊</span>
                  <span className={styles.detailLabel}>Status:</span>
                  <span className={styles.detailValue}>{pet.status}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📍</span>
                  <span className={styles.detailLabel}>Location:</span>
                  <span className={styles.detailValue}>
                    {pet.barangay}, {pet.city}, {pet.country}
                  </span>
                </div>
              </div>

              <div className={styles.buttonGroup}>
  <button
    className={styles.adoptButton}
    onClick={() => navigate(`/adopt/${id}`)}
  >
    Submit Adoption Form
  </button>

  {pet.owner?.id && (
    <button
      className={styles.messageButton}
      onClick={() => navigate(`/messages/${pet.owner.id}`)}
    >
      Message Owner
    </button>
  )}
</div>

              
            </div>
          </div>

          {pet.latitude && pet.longitude && isLoaded && (
            <div className={styles.mapContainer}>
              <h3 className={styles.mapTitle}>Exact Location</h3>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: pet.latitude, lng: pet.longitude }}
                zoom={14}
              >
                <Marker position={{ lat: pet.latitude, lng: pet.longitude }} />
              </GoogleMap>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className={styles.faqSection}>
  <h2 className={styles.faqHeading}>Frequently Asked Questions</h2>
  <div className={styles.faqList}>
    
    <div className={styles.faqItem}>
      <h3 className={styles.faqQuestion}>What is the adoption process like?</h3>
      <p className={styles.faqAnswer}>
        After submitting the adoption form, our team will review your application within 24–48 hours. 
        We will then reach out to schedule a short interview before finalizing the adoption.
      </p>
    </div>

    <div className={styles.faqItem}>
      <h3 className={styles.faqQuestion}>Are the pets vaccinated and neutered?</h3>
      <p className={styles.faqAnswer}>
        Yes, all pets are fully vaccinated, dewormed, and neutered before they become available for adoption.
      </p>
    </div>

    <div className={styles.faqItem}>
      <h3 className={styles.faqQuestion}>Can I return a pet if it doesn't work out?</h3>
      <p className={styles.faqAnswer}>
        Absolutely. We offer a 14-day return window and provide assistance to ensure a smooth transition back to our care.
      </p>
    </div>

  </div>
</div>


      </div>
    </div>
  );
}

export default PetDetails;
