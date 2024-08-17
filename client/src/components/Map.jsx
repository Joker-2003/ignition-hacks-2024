import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
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

const markerColors = [
  'red', 'blue', 'green', 'purple', 'orange',
  'brown', 'pink', 'yellow', 'cyan', 'magenta',
  'grey', 'lime', 'indigo', 'teal', 'coral',
  'navy', 'aqua', 'fuchsia', 'silver', 'maroon',
  'olive'
];

const generateMarkers = (userLocation) => {
  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    position: {
      lat: userLocation.lat + (Math.random() - 0.5) * 0.05, // Adjust range as needed
      lng: userLocation.lng + (Math.random() - 0.5) * 0.05, // Adjust range as needed
    },
    label: `Food ${index + 1}`,
    color: markerColors[index % markerColors.length]
  }));
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [directions, setDirections] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          if (mapRef.current) {
            mapRef.current.panTo(userPos);
          }
        },
        () => null
      );
    }
  }, []);

  const onLoad = (map) => {
    setMap(map);
    mapRef.current = map;
  };

  const handleMapClick = (event) => {
    setSelectedPOI({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setSelectedPOI(marker.position);
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

  // Memoize markers array
  const markers = useMemo(() => {
    return userLocation ? generateMarkers(userLocation) : [];
  }, [userLocation]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API}>
      <div style={panelStyle}>
        <button onClick={() => userLocation && mapRef.current && mapRef.current.panTo(userLocation)}>
          Pan to My Location
        </button>
        {selectedMarker && (
          <div>
            <h4>{selectedMarker.label}</h4>
            <button onClick={getDirections}>Get Directions</button>
          </div>
        )}
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onClick={handleMapClick}
      >
        {userLocation && <Marker position={userLocation} label="You" />}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            label={marker.label}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: marker.color,
              fillOpacity: 0.8,
              strokeWeight: 0,
            }}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
