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
  overflowY: 'scroll',
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
  const [directionDetails, setDirectionDetails] = useState('');

  const mapRef = useRef(null);

  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

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
            const { distance, duration } = result.routes[0].legs[0];
            setDirectionDetails(`Distance: ${distance.text}, Duration: ${duration.text}`);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  };

  const markers = useMemo(() => {
    return userLocation ? generateMarkers(userLocation) : [];
  }, [userLocation]);

  useEffect(() => {
    if (map && userLocation) {
      const circleOptions = [
        { radius: 2000, color: '#ff0000', label: '0-2km' },
        { radius: 4000, color: '#00ff00', label: '2-4km' },
        { radius: 10000, color: '#0000ff', label: '4-10km' }
      ];

      circleOptions.forEach(({ radius, color, label }) => {
        new window.google.maps.Circle({
          center: userLocation,
          radius: radius,
          strokeColor: color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.35,
          zIndex: -1,
          map: map,
        });
      });
    }
  }, [map, userLocation]);

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
        {directionDetails && <div><h4>Directions</h4><p>{directionDetails}</p></div>}
        <div style={{ marginTop: '20px' }}>
          <h4>Legend</h4>
          <div><span style={{ backgroundColor: '#ff0000', width: '20px', height: '20px', display: 'inline-block' }}></span> 0-2km</div>
          <div><span style={{ backgroundColor: '#00ff00', width: '20px', height: '20px', display: 'inline-block' }}></span> 2-4km</div>
          <div><span style={{ backgroundColor: '#0000ff', width: '20px', height: '20px', display: 'inline-block' }}></span> 4-10km</div>
        </div>
      </div>
      <div style={mapContainerStyle}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
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
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: '#0000FF',
                  strokeWeight: 5,
                },
                suppressMarkers: true,
              }}
              style={{ zIndex: 10000 }} 
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default Map;
