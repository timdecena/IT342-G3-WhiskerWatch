// src/pages/PostLostPet.jsx
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import '../assets/PostPets.css'; // Reuse the same styling

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};
const center = {
  lat: 14.5995,
  lng: 120.9842
};

const PostLostPet = () => {
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    description: '',
    status: 'LOST', // or FOUND
    country: '',
    city: '',
    barangay: '',
    image: null
  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as", // Use ENV in production
    libraries
  });

  const onMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as`
      );

      const addressComponents = response.data.results[0]?.address_components || [];
      let country = '', city = '', barangay = '';

      addressComponents.forEach(component => {
        if (component.types.includes('country')) country = component.long_name;
        if (component.types.includes('locality')) city = component.long_name;
        if (component.types.includes('sublocality_level_1')) barangay = component.long_name;
      });

      setFormData(prev => ({
        ...prev,
        country,
        city,
        barangay
      }));
    } catch (error) {
      setMessage('Error getting location details. Please try again.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!markerPosition) {
      setMessage('Please select a location on the map');
      setIsLoading(false);
      return;
    }

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      setMessage('User ID or token not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    const lostPetFormData = new FormData();
    const lostPetData = {
      petName: formData.petName,
      species: formData.species,
      description: formData.description,
      status: formData.status,
      country: formData.country,
      city: formData.city,
      barangay: formData.barangay,
      latitude: markerPosition.lat,
      longitude: markerPosition.lng
    };

    lostPetFormData.append('lostPet', new Blob([JSON.stringify(lostPetData)], { type: 'application/json' }));
    if (formData.image) {
      lostPetFormData.append('image', formData.image);
    }

    try {
      await axios.post(
        `http://localhost:8080/api/lostfoundpets/add/${userId}`,
        lostPetFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('Lost/Found pet posted successfully!');
      setFormData({
        petName: '',
        species: '',
        description: '',
        status: 'LOST',
        country: '',
        city: '',
        barangay: '',
        image: null
      });
      setMarkerPosition(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-pets-wrapper">
      <div className="post-pets-container">
        <h2>Post Lost/Found Pet</h2>
        <form onSubmit={handleSubmit} className="post-pet-form-horizontal" encType="multipart/form-data">
          <div className="form-row">
            <div className={`form-group ${focusedField === 'petName' ? 'focused' : ''}`}>
              <label>Pet Name</label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                onFocus={() => handleFocus('petName')}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className={`form-group ${focusedField === 'species' ? 'focused' : ''}`}>
                <label>Species</label>
                  <select
                   name="species"
                    value={formData.species}
                    onChange={handleChange}
                    onFocus={() => handleFocus('species')}
                    onBlur={handleBlur}
                    required>    
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${focusedField === 'description' ? 'focused' : ''}`}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => handleFocus('description')}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className={`form-group ${focusedField === 'status' ? 'focused' : ''}`}>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                onFocus={() => handleFocus('status')}
                onBlur={handleBlur}
              >
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group map-container">
              <label>Select Location</label>
              {!isLoaded ? (
                <div>Loading map...</div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={12}
                  center={center}
                  onClick={onMapClick}
                >
                  {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
              )}
              <div className="location-details">
                {formData.country && <p>Country: {formData.country}</p>}
                {formData.city && <p>City: {formData.city}</p>}
                {formData.barangay && <p>Barangay: {formData.barangay}</p>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Upload Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Post Lost/Found Pet'}
          </button>
        </form>

        {message && (
          <p className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default PostLostPet;
