import Layout from "../Components/Layout";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../assets/PostPets.css";
import { useParams } from 'react-router-dom';

const GOOGLE_MAPS_API_KEY = "AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as";
const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 14.5995, lng: 120.9842 };

function UpdatePet() {
    const { petId } = useParams(); 
  const [formData, setFormData] = useState({
    petName: "",
    species: "",
    breed: "",
    age: "",
    status: "",
    country: "",
    city: "",
    barangay: "",
    image: null,
  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [focusedField, setFocusedField] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Fetch existing pet data on mount
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/pets/${petId}`);
        setFormData({
          petName: data.petName,
          species: data.species,
          breed: data.breed,
          age: data.age,
          status: data.status,
          country: data.country,
          city: data.city,
          barangay: data.barangay,
          image: null,
        });
        setMarkerPosition({ lat: data.latitude, lng: data.longitude });
      } catch {
        setMessage("Failed to fetch pet data. Please try again.");
      }
    };
    fetchPetData();
  }, [petId]);

  const onMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });

    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const components = data.results[0]?.address_components || [];
      let country = "", city = "", barangay = "";

      components.forEach((comp) => {
        if (comp.types.includes("country")) country = comp.long_name;
        if (comp.types.includes("locality")) city = comp.long_name;
        if (comp.types.includes("sublocality_level_1")) barangay = comp.long_name;
      });

      setFormData((prev) => ({ ...prev, country, city, barangay }));
    } catch {
      setMessage("Error getting location details. Please try again.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!markerPosition) {
      setMessage("Please select a location on the map.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Token not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      latitude: markerPosition.lat,
      longitude: markerPosition.lng,
    };

    const petFormData = new FormData();
    petFormData.append("pet", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (formData.image) petFormData.append("image", formData.image);

    try {
      await axios.put(`http://localhost:8080/api/pets/${petId}`, petFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Pet updated successfully!");
      setFormData({
        petName: "",
        species: "",
        breed: "",
        age: "",
        status: "",
        country: "",
        city: "",
        barangay: "",
        image: null,
      });
      setMarkerPosition(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update pet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-pets-wrapper">
      <div className="post-pets-container">
        <h2>Update Pet Information</h2>
        <form onSubmit={handleSubmit} className="post-pet-form-horizontal" encType="multipart/form-data">
          {/* Name & Species */}
          <div className="form-row">
            <div className={`form-group ${focusedField === "petName" ? "focused" : ""}`}>
              <label>Pet Name</label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                onFocus={() => setFocusedField("petName")}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>
            <div className={`form-group ${focusedField === "species" ? "focused" : ""}`}>
              <label>Species</label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                onFocus={() => setFocusedField("species")}
                onBlur={() => setFocusedField(null)}
                required
              >
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>
          </div>

          {/* Breed & Age */}
          <div className="form-row">
            <div className={`form-group ${focusedField === "breed" ? "focused" : ""}`}>
              <label>Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                onFocus={() => setFocusedField("breed")}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>
            <div className={`form-group ${focusedField === "age" ? "focused" : ""}`}>
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onFocus={() => setFocusedField("age")}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="form-row">
            <div className={`form-group ${focusedField === "status" ? "focused" : ""}`}>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                onFocus={() => setFocusedField("status")}
                onBlur={() => setFocusedField(null)}
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

          {/* Map */}
          <div className="form-row">
            <div className="form-group map-container">
              <label>Select Pet Location</label>
              {!isLoaded ? (
                <div>Loading map...</div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={12}
                  center={defaultCenter}
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

          {/* Image Upload */}
          <div className="form-row">
            <div className="form-group">
              <label>Upload Image (Optional)</label>
              <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className={`submit-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? "" : "Update Pet"}
          </button>
        </form>

        {message && <p className={`status-message ${message.includes("success") ? "success" : "error"}`}>{message}</p>}
      </div>
    </div>
  );
}

export default UpdatePet;
