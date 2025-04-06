import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiBell } from "react-icons/fi";
import "../assets/header.css";

function Header({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Retrieve userId from localStorage if not passed as a prop
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchAdoptionRequests();
    }
  }, [isAuthenticated, userId]);

  const fetchAdoptionRequests = async () => {
    try {
      setLoadingRequests(true);
      console.log("Fetching requests for user ID:", userId);
      
      const response = await fetch(`http://localhost:8080/api/adoptions`);
      if (!response.ok) throw new Error("Failed to fetch requests");
      
      const data = await response.json();
      console.log("All requests:", data);
      
      // Filter requests where current user is the pet owner
      const userRequests = data.filter(request => 
        request.pet?.owner?.id === parseInt(userId)
      );
      
      console.log("Filtered requests:", userRequests);
      setAdoptionRequests(userRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const handleStatusUpdate = async (adoptionId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8080/api/adoptions/update-status/${adoptionId}/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ status }),
        }
      );
      
      if (response.ok) {
        await fetchAdoptionRequests();
        setSelectedRequest(null);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const toggleRequests = () => {
    setRequestsOpen(!requestsOpen);
    if (!requestsOpen) fetchAdoptionRequests();
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/homepage" className="logo">
          <span style={{ color: "#8b5cf6" }}>WhiskerWatch</span>
        </Link>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/homepage" onClick={closeMenu}>Home</Link>
          <Link to="/post-pets" onClick={closeMenu}>Post a Pet</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>

          {isAuthenticated && (
            <div className="requests-dropdown">
              <button 
                className="requests-btn" 
                onClick={toggleRequests}
                disabled={loadingRequests}
              >
                <FiBell />
                {loadingRequests ? (
                  <span className="loading-spinner"></span>
                ) : (
                  adoptionRequests.filter(r => r.status === "Pending").length > 0 && (
                    <span className="notification-badge">
                      {adoptionRequests.filter(r => r.status === "Pending").length}
                    </span>
                  )
                )}
              </button>
              
              {requestsOpen && (
                <div className="requests-dropdown-content">
                  {loadingRequests ? (
                    <div className="request-item">Loading...</div>
                  ) : adoptionRequests.length === 0 ? (
                    <div className="request-item">No adoption requests</div>
                  ) : (
                    adoptionRequests.map((request) => (
                      <div 
                        key={request.id} 
                        className={`request-item ${request.status.toLowerCase()}`}
                        onClick={() => setSelectedRequest(request)}
                      >
                        <strong>{request.pet?.petName || "Unknown Pet"}</strong>
                        <span>Status: {request.status}</span>
                        {request.status === "Pending" && (
                          <span className="pending-badge">New</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/" className="login-btn" onClick={closeMenu}>
              Sign In
            </Link>
          )}
        </nav>
      </div>

      {selectedRequest && (
        <div className="modal-overlay">
          <div className="request-modal">
            <h3>Adoption Request for {selectedRequest.pet?.petName || "Unknown Pet"}</h3>
            <div className="request-details">
              <p><strong>Adopter:</strong> {selectedRequest.adopterName}</p>
              <p><strong>Contact:</strong> {selectedRequest.adopterContact}</p>
              <p><strong>Message:</strong> {selectedRequest.messageToOwner}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Date:</strong> {new Date(selectedRequest.adoptionDate).toLocaleDateString()}</p>
            </div>
            
            {selectedRequest.status === "Pending" && (
              <div className="request-actions">
                <button 
                  className="accept-btn"
                  onClick={() => handleStatusUpdate(selectedRequest.id, "Approved")}
                >
                  Accept
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleStatusUpdate(selectedRequest.id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            )}
            
            <button 
              className="close-btn"
              onClick={() => setSelectedRequest(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
