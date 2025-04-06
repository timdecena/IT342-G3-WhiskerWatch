import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiBell } from "react-icons/fi";
import "../assets/header.css";

function Header({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchAdoptionRequests();
    }
  }, [isAuthenticated, userId]);

  const fetchAdoptionRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await fetch(`http://localhost:8080/api/adoptions`);
      if (!response.ok) throw new Error("Failed to fetch requests");

      const data = await response.json();
      const userRequests = data.filter(request => request.pet?.owner?.id === parseInt(userId));
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
          <Link to="/homepage" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/post-pets" onClick={() => setMenuOpen(false)}>Post a Pet</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

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
                      >
                        <strong>{request.pet?.petName || "Unknown Pet"}</strong>
                        <span style={{ marginLeft: '8px' }}>Status: {request.status}</span>  {/* Added margin */}
                        {request.status === "Pending" && (
                          <span className="pending-badge">New</span>
                        )}

                        <div className="request-actions">
                          <button 
                            onClick={() => navigate(`/adoption-request/${request.id}`)}
                          >
                            View Details
                          </button>
                        </div>
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
            <Link to="/" className="login-btn" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
