import Layout from "../Components/Layout";
import { useState, useCallback } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import '../assets/PostPets.css';
import BASE_URL from '../Components/Config'; 
const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};
const center = {
  lat: 10.3157,
  lng: 123.8854
};

function PostPets() {
  const [formData, setFormData] = useState({
    petName: "",
    species: "",
    breed: "",
    age: "",
    status: "",
    country: "",
    city: "",
    barangay: "",
    image: null
  });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [focusedField, setFocusedField] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as",
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

    const petFormData = new FormData();
    const petData = {
      petName: formData.petName,
      species: formData.species,
      breed: formData.breed,
      age: formData.age,
      status: formData.status,
      country: formData.country,
      city: formData.city,
      barangay: formData.barangay,
      latitude: markerPosition.lat,
      longitude: markerPosition.lng
    };

    petFormData.append('pet', new Blob([JSON.stringify(petData)], { type: 'application/json' }));
    petFormData.append('image', formData.image);

    try {
      await axios.post(
        `${BASE_URL}/api/pets/add/${userId}`,
        petFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('Pet added successfully!');
      setFormData({
        petName: "",
        species: "",
        breed: "",
        age: "",
        status: "",
        country: "",
        city: "",
        barangay: "",
        image: null
      });
      setMarkerPosition(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add pet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-pets-wrapper">
      <div className="post-pets-container">
        <h2>Add a New Pet</h2>
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
                required
              >
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${focusedField === 'breed' ? 'focused' : ''}`}>
              <label>Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                onFocus={() => handleFocus('breed')}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className={`form-group ${focusedField === 'age' ? 'focused' : ''}`}>
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onFocus={() => handleFocus('age')}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${focusedField === 'status' ? 'focused' : ''}`}>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                onFocus={() => handleFocus('status')}
                onBlur={handleBlur}
                required
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Injured">Injured</option>
                <option value="Disabled">Disabled</option>
                <option value="Chronic Condition">Chronic Condition</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group map-container">
              <label>Select Pet Location</label>
              {!isLoaded ? (
                <div>Loading map...</div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={12}
                  center={center}
                  onClick={onMapClick}
                  onLoad={() => setIsMapLoading(false)}
                >
                  {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
              )}
              {isMapLoading && <div className="map-loading">Loading map...</div>}
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
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Add Pet'}
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
}

export default PostPets;