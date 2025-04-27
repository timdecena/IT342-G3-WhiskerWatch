import React, { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapsWrapper = ({ children }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR-API-KEY", // Replace with your actual API key
    libraries: ["places", "maps"],  // Ensure consistent libraries are loaded
    version: "weekly",              // Ensure same version
    region: "US",                   // Ensure consistent region
  });

  // If not loaded, show a loading indicator
  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return <>{children}</>;
};

export default GoogleMapsWrapper;
