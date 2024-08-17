import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const defaultCenter = {
  lat: 37.7749, // Default to San Francisco
  lng: -122.4194,
};

const panelStyle = {
  width: '300px',
  height: '100vh',
  padding: '20px',
  backgroundColor: '#fff',
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  position: 'fixed',
  top: '0',
  left: '0',
  zIndex: '1',
};

const mapContainerStyle = {
  width: 'calc(100% - 300px)',
  height: '100vh',
  marginLeft: '300px',
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [directions, setDirections] = useState(null);

  const mapRef = useRef(null);

  const onLoad = (map) => {
    setMap(map);
    mapRef.current = map;
  };

  const panToUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          mapRef.current.panTo(userPos);
        },
        () => null
      );
    }
  };

  const handleMapClick = (event) => {
    setSelectedPOI({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const getDirections = () => {
    if (userLocation && selectedPOI) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: selectedPOI,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API}>
      <div style={panelStyle}>
        <button onClick={panToUserLocation}>Pan to My Location</button>
        {selectedPOI && (
          <div>
            <h4>Point of Interest</h4>
            <button onClick={getDirections}>Get Directions</button>
          </div>
        )}
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onClick={handleMapClick}
      >
        {userLocation && <Marker position={userLocation} label="You" />}
        {selectedPOI && <Marker position={selectedPOI} label="POI" />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
