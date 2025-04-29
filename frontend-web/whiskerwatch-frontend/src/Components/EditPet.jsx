import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import '../assets/PostPets.css';
import Layout from "../Components/Layout";

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};
const center = {
  lat: 14.5995,
  lng: 120.9842
};

function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [currentImage, setCurrentImage] = useState('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as",
    libraries
  });

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://ec2-35-168-15-40.compute-1.amazonaws.com:8080/api/pets/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const pet = response.data;
        setFormData({
          petName: pet.petName,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          status: pet.status,
          country: pet.country || '',
          city: pet.city || '',
          barangay: pet.barangay || '',
          image: null
        });

        if (pet.image) {
          setCurrentImage(`http://ec2-35-168-15-40.compute-1.amazonaws.com:8080/uploads/${pet.image}`);
        }

        if (pet.latitude && pet.longitude) {
          setMarkerPosition({
            lat: pet.latitude,
            lng: pet.longitude
          });
        }
      } catch (error) {
        setMessage('Failed to fetch pet data. Please try again.');
        console.error('Error fetching pet:', error);
      }
    };

    fetchPetData();
  }, [id, navigate]);

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
    if (e.target.files[0]) {
      setCurrentImage(URL.createObjectURL(e.target.files[0]));
    }
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

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      // First update the pet data including location
      const petData = {
        petName: formData.petName,
        species: formData.species,
        breed: formData.breed,
        age: formData.age,
        status: formData.status,
        country: formData.country,
        city: formData.city,
        barangay: formData.barangay,
        latitude: markerPosition?.lat,
        longitude: markerPosition?.lng
      };

      await axios.put(
        `http://ec2-35-168-15-40.compute-1.amazonaws.com:8080/api/pets/${id}`,
        petData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Then update the image if a new one was provided
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.image);

        await axios.post(
          `http://ec2-35-168-15-40.compute-1.amazonaws.com:8080/api/pets/${id}/image`,
          imageFormData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      setMessage('Pet updated successfully!');
      setTimeout(() => {
        navigate('/yourpets');
      }, 1500);
    } catch (error) {
      console.error('Update error:', error);
      setMessage(error.response?.data?.message || 'Failed to update pet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="post-pets-wrapper">
        <div className="post-pets-container">
          <h2>Edit Pet Details</h2>
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
                <label>Update Pet Location</label>
                {!isLoaded ? (
                  <div>Loading map...</div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={markerPosition || center}
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
                <label>Update Image</label>
                {currentImage && (
                  <div className="current-image-preview">
                    <img src={currentImage} alt="Current pet" />
                    <p>Current Image</p>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="form-row actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/your-pets')}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? '' : 'Update Pet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default EditPet;

