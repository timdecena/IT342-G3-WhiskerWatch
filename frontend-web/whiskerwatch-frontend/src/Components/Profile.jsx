import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/Profile.css';
import axios from 'axios';
import BASE_URL from '../Components/Config';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    pets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndPets = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          navigate('/');
          return;
        }

        const userResponse = await axios.get(`${BASE_URL}/api/users/getUserById/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const petResponse = await axios.get(`${BASE_URL}/api/pets`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const allPets = petResponse.data;
        const userPets = allPets.filter(
          (pet) => !pet.isDeleted && String(pet.owner?.id) === String(userId)
        );

        setUserData({
          firstName: userResponse.data.firstName || '',
          lastName: userResponse.data.lastName || '',
          email: userResponse.data.email || '',
          pets: userPets
        });
      } catch (err) {
        setError('Failed to fetch user data or pets');
        if (err.response?.status === 401) navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPets();
  }, [navigate]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {userData.firstName[0]?.toUpperCase()}
            {userData.lastName[0]?.toUpperCase()}
          </div>
          <h1>{userData.firstName} {userData.lastName}</h1>
          <p className="email">{userData.email}</p>
          <Link to="/user-profile" className="edit-profile-btn">
            Edit Profile
          </Link>
        </div>

        <div className="profile-content">
          <section className="details-section">
            <h2>Account Details</h2>
            <div className="detail-item">
              <span className="detail-label">First Name:</span>
              <span className="detail-value">{userData.firstName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Name:</span>
              <span className="detail-value">{userData.lastName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Registered Email:</span>
              <span className="detail-value">{userData.email}</span>
            </div>
          </section>

          <section className="pets-section">
            <h2>My Pets</h2>
            <div className="pets-grid">
              {userData.pets.length > 0 ? (
                userData.pets.map(pet => (
                  <div className="pet-card" key={pet.id}>
                    <div className="pet-avatar">🐾</div>
                    <h3>{pet.petName}</h3>
                    <p><strong>Breed:</strong> {pet.breed || 'Unknown'}</p>
                    <p><strong>Age:</strong> {pet.age || 'N/A'}</p>
                    <p><strong>Status:</strong> {pet.status || 'N/A'}</p>
                    <p><strong>Species:</strong> {pet.species || 'N/A'}</p>
                    <p><strong>Location:</strong> {pet.location || `${pet.country || ''}, ${pet.city || ''}, ${pet.barangay || ''}`}</p>
                    </div>
                ))
              ) : (
                <p className="no-pets">No pets registered yet</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
