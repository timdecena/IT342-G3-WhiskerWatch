import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/AdoptionRequestDetail.css";
import BASE_URL from '../Components/Config'; 

function AdoptionRequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch request details on load
  const fetchRequestDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/adoptions/${requestId}`);
      if (!response.ok) throw new Error("Failed to fetch request details");

      const data = await response.json();
      setRequest(data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  // Handle the status update for adoption requests
  const handleStatusUpdate = async (status) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // Send the request to the back-end
      const response = await fetch(
        `${BASE_URL}/api/adoptions/update-status/${requestId}/${userId}?status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      // Check response
      if (response.ok) {
        alert(`Request ${status}`);
        navigate("/homepage");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating the status");
    }
  };

  return (
    <div className="adoption-request-detail">
      {loading ? (
        <p>Loading...</p>
      ) : (
        request && (
          <>
            <h1>Adoption Request for {request.pet?.petName}</h1>
            <p><strong>Adopter:</strong> {request.adopterName}</p>
            <p><strong>Contact:</strong> {request.adopterContact}</p>
            <p><strong>Message:</strong> {request.messageToOwner}</p>
            <p><strong>Status:</strong> {request.status}</p>
            <p><strong>Date:</strong> {new Date(request.adoptionDate).toLocaleDateString()}</p>

            {request.status === "Pending" && (
              <div className="actions">
                <button onClick={() => handleStatusUpdate("Approved")}>Accept</button>
                <button onClick={() => handleStatusUpdate("Rejected")}>Reject</button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}

export default AdoptionRequestDetail;
