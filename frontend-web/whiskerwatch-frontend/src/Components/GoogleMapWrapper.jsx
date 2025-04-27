import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { GoogleMap, Marker } from "@react-google-maps/api";

const GoogleMapWrapper = ({ pet }) => {
  // Check if pet is provided and has latitude/longitude
  if (!pet || !pet.latitude || !pet.longitude) {
    return <div>Location information not available.</div>;
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAi6t6s9HB1NyToVrDhpvn3PHMSrpC_1as",
  });

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "12px",
    marginTop: "10px",
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{ lat: pet.latitude, lng: pet.longitude }}
      zoom={14}
    >
      <Marker position={{ lat: pet.latitude, lng: pet.longitude }} />
    </GoogleMap>
  );
};

export default GoogleMapWrapper;
