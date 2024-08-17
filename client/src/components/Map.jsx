import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import './map.css';
import { GoogleLogin, GoogleLogout } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../App';
import { fetchAllRestaurants, UserLogin } from '../api/api';

const markerColors = [
  'red', 'blue', 'green', 'purple', 'orange',
  'brown', 'pink', 'yellow', 'cyan', 'magenta',
  'grey', 'lime', 'indigo', 'teal', 'coral',
  'navy', 'aqua', 'fuchsia', 'silver', 'maroon',
  'olive'
];
let userPos;

const generateMarkers = (userLocation) => {
  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    position: {
      lat: userLocation.lat + (Math.random() - 0.5) * 0.05,
      lng: userLocation.lng + (Math.random() - 0.5) * 0.05,
    },
    label: `Food ${index + 1}`,
    color: markerColors[index % markerColors.length]
  }));
};


const Map = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [directions, setDirections] = useState({ driving: null, walking: null });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directionDetails, setDirectionDetails] = useState('');
  const [showCircles, setShowCircles] = useState(true);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [circles, setCircles] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [disableLogin, setDisableLogin] = useState(false);
  const [filters, setFilters] = useState({
    halal: false,
    vegetarian: false,
  });
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useGlobalState('user');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [markers, setMarkers] = useState([]);

  const mapRef = useRef(null);
  const navigate = useNavigate();

  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          if (mapRef.current) {
            mapRef.current.panTo(userPos);
            mapRef.current.setZoom(15); // Set zoom level when centering on user location
          }
        },
        () => null
      );
    }
  }, []);

  useEffect(() => {
    console.log(filters);
    console.log("res", restaurants);
    if (filters.halal || filters.vegetarian) {
      setFilteredRestaurants(
        restaurants.filter((restaurant) => {
          if (filters.halal && !restaurant.dietaryOptions.isHalal) {
            return false;
          }
          if (filters.vegetarian && !restaurant.dietaryOptions.isVegetarian) {
            return false;
          }
          return true;
        })
      );
    } else {
      setFilteredRestaurants(restaurants);
    }
    console.log(filteredRestaurants);
  }, [filters, restaurants]);

  useEffect(() => {
    async function fetchData() {
      let res = await fetchAllRestaurants();
      console.log(res);
      setRestaurants(res.restaurants);
    }
    fetchData();
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

      // Fetch driving route
      directionsService.route(
        {
          origin: userLocation,
          destination: selectedPOI,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections((prev) => ({
              ...prev,
              driving: result
            }));
            if (travelMode === 'DRIVING') {
              const { distance, duration } = result.routes[0].legs[0];
              setDirectionDetails(`Driving - Distance: ${distance.text}, Duration: ${duration.text}`);
            }
          } else {
            console.error(`Error fetching driving directions ${result}`);
          }
        }
      );


      directionsService.route(
        {
          origin: userLocation,
          destination: selectedPOI,
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections((prev) => ({
              ...prev,
              walking: result
            }));
            if (travelMode === 'WALKING') {
              const { distance, duration } = result.routes[0].legs[0];
              setDirectionDetails(`Walking - Distance: ${distance.text}, Duration: ${duration.text}`);
            }
          } else {
            console.error(`Error fetching walking directions ${result}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (selectedPOI) {
      getDirections();
    }
  }, [selectedPOI, travelMode]);

  useEffect(() => {
    if (map && userLocation && showCircles) {
      // Remove old circles
      circles.forEach(circle => circle.setMap(null));

      const newCircles = [
        { radius: 2000, color: '#ff0000', label: '0-2km' },
        { radius: 4000, color: '#00ff00', label: '2-4km' },
        { radius: 10000, color: '#0000ff', label: '4-10km' }
      ].map(({ radius, color, label }) =>
        new window.google.maps.Circle({
          center: userLocation,
          radius: radius,
          strokeColor: color,
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: color,
          fillOpacity: 0.15,
          zIndex: -1,
          map: map,
        })
      );

      setCircles(newCircles);
    }
    if (!showCircles) {
      circles.forEach(circle => circle.setMap(null));
      setCircles([]);
    }
  }, [map, userLocation, showCircles]);

  // const markers = useMemo(() => {
  //   return userLocation ? generateMarkers(userLocation) : [];
  // }, [userLocation]);

  const handleFilterChange = (filterName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const handleLogin = async () => {
    setDisableLogin(true);
    if (loggedIn) {
      try {
        await GoogleLogout();
        setLoggedIn(false);
        setUser(null);
      }
      catch (error) {
        console.log(error);
      }
    }
    else {
      try {
        let result = await GoogleLogin();
        let res = await UserLogin(result.user.email, result.user.uid);
        setUser(res.user);
        console.log(res);
        setLoggedIn(true);
      }
      catch (error) {
        console.log(error);
      }

    };
    setDisableLogin(false);
  }
  const handleAddRestaurant = async () => {
    if (loggedIn) {
      navigate('/add-restaurant');
    }
    else {
      await handleLogin();

      console.log("Logged in");
      navigate('/add-restaurant');

    }
  }


  const RestaurantCardBrief = ({ formData }) => {
    const {
      id,
      name,
      address,
      cuisine,
      location,
      phone,
      distance,
      bookingCount,
      quantity,
      hours,
    } = formData;

    const handleDirectionsClick = () => {
      if (userLocation && location) {
      const directionsService = new window.google.maps.DirectionsService();
      
      const givenLocation = {
        lat: parseFloat(location.latitude),
        lng: parseFloat(location.longitude),
      };
      // Fetch driving route
      directionsService.route(
        {
          origin: userLocation,
          destination: givenLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections((prev) => ({
              ...prev,
              driving: result
            }));
            if (travelMode === 'DRIVING') {
              const { distance, duration } = result.routes[0].legs[0];
              setDirectionDetails(`Driving - Distance: ${distance.text}, Duration: ${duration.text}`);
            }
          } else {
            console.error(`Error fetching driving directions ${result}`);
          }
        }
      );


      directionsService.route(
        {
          origin: userLocation,
          destination: givenLocation,
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections((prev) => ({
              ...prev,
              walking: result
            }));
            if (travelMode === 'WALKING') {
              const { distance, duration } = result.routes[0].legs[0];
              setDirectionDetails(`Walking - Distance: ${distance.text}, Duration: ${duration.text}`);
            }
          } else {
            console.error(`Error fetching walking directions ${result}`);
          }
        }
      );
    }
    }

    return (
      <div className="restaurant-card-brief">
        <h2 className="restaurant-card-title">{name}</h2>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Cuisine:</strong> {cuisine}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Distance:</strong> {distance}</p>
        <p><strong>Booking Count:</strong> {bookingCount}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Distribution Hours:</strong> {hours.start} - {hours.end}</p>
        <div className="buttons">
          <button className="btn btn-primary">Book Now</button>
          <button className="btn btn-secondary" onClick={handleDirectionsClick}>Get Directions</button>
        </div>
      </div>
    );
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API} >
      <div className="panel">
        <button onClick={() => userLocation && mapRef.current && mapRef.current.panTo(userLocation)}>
          Pan to My Location
        </button>
        <button onClick={() => setShowCircles((prev) => !prev)}>
          {showCircles ? 'Hide Circles' : 'Show Circles'}
        </button>
        <button onClick={() => { setTravelMode('DRIVING'); }}>Driving Directions</button>
        <button onClick={() => { setTravelMode('WALKING'); }}>Walking Directions</button>
        {selectedMarker && (
          <div>
            <h4 className="marker-label">{selectedMarker.label}</h4>
            <button onClick={() => getDirections()}>Get Directions</button>
          </div>
        )}
        {directionDetails && (
          <div className="directions-details">
            <h4>Directions</h4>
            <p>{directionDetails}</p>
          </div>
        )}
        <div className="legend">
          <h4>Legend</h4>
          <div><span style={{ backgroundColor: '#ff0000' }}></span> 0-2km</div>
          <div><span style={{ backgroundColor: '#00ff00' }}></span> 2-4km</div>
          <div><span style={{ backgroundColor: '#0000ff' }}></span> 4-10km</div>
        </div>
        <div className="restaurant-list">
          {filteredRestaurants.length && filteredRestaurants.map((restaurant) => (
            <RestaurantCardBrief key={restaurant.id} formData={restaurant} />
          ))}
        </div>
      </div>
      <div className="map-container">
        <div className="top-left-controls">
          <div className="dropdown">
            <button className="dropbtn">Filters</button>
            <div className="dropdown-content">
              <label>
                <input
                  type="checkbox"
                  checked={filters.halal}
                  onChange={() => handleFilterChange('halal')}
                />
                Halal
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.vegetarian}
                  onChange={() => handleFilterChange('vegetarian')}
                />
                Vegetarian
              </label>
            </div>
          </div>
        </div>
        <div className="top-right-controls">
          <button className="login-btn" disabled={disableLogin} onClick={handleLogin}>{loggedIn ? "Logout" : "Login"}</button>
          <button className="add-restaurant-btn" disabled={disableLogin} onClick={handleAddRestaurant}>Add Restaurant</button>
        </div>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={userLocation || defaultCenter}
          zoom={10}
          onLoad={onLoad}
          onClick={handleMapClick}
          options={
            {
              disableDefaultUI: true,
              zoomControl: true,
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,

            }
          }
        >
          {userLocation && <Marker position={userLocation} label="You" />}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              label={
                <span >
                  {marker.label}
                </span>
              }
              icon={{
                path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 10,
                fillColor: marker.color,
                fillOpacity: 0.8,
                strokeWeight: 0,
              }}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}
          {(travelMode === 'DRIVING' && directions.driving) && (
            <DirectionsRenderer directions={directions.driving} />
          )}
          {(travelMode === 'WALKING' && directions.walking) && (
            <DirectionsRenderer directions={directions.walking} />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default Map;
