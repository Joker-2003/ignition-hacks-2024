import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 37.7749, // Default to San Francisco
  lng: -122.4194
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [directionsUrl, setDirectionsUrl] = useState('');

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

  useEffect(() => {
    if (selectedPOI && userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedPOI.lat},${selectedPOI.lng}`;
      setDirectionsUrl(url);
    }
  }, [selectedPOI, userLocation]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API}>
      <div>
        <button onClick={panToUserLocation}>Pan to My Location</button>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={10}
          onLoad={onLoad}
          onClick={handleMapClick}
        >
          {userLocation && <Marker position={userLocation} label="You" />}
          {selectedPOI && (
            <Marker position={selectedPOI} label="POI">
              <InfoWindow position={selectedPOI}>
                <div>
                  <h4>Point of Interest</h4>
                  <button onClick={() => window.open(directionsUrl, '_blank')}>
                    Get Directions
                  </button>
                </div>
              </InfoWindow>
            </Marker>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default Map;
