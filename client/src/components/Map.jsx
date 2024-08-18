import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import './map.css';
import { GoogleLogin, GoogleLogout } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../App';
import { bookSlot, fetchAllRestaurants, fetchUser, removeBooking, UserLogin } from '../api/api';
import RestaurantBrief from './RestaurantBrief';

const markerColors = [
  'red', 'blue', 'green', 'purple', 'orange',
  'brown', 'pink', 'yellow', 'cyan', 'magenta',
  'grey', 'lime', 'indigo', 'teal', 'coral',
  'navy', 'aqua', 'fuchsia', 'silver', 'maroon',
  'olive'
];
let userPos;



const Map = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useGlobalState('userLocation');
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [directions, setDirections] = useGlobalState('directions');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directionDetails, setDirectionDetails] = useGlobalState('directionDetails');
  const [showCircles, setShowCircles] = useState(true);
  const [travelMode, setTravelMode] = useGlobalState('travelMode');
  const [circles, setCircles] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [disableLogin, setDisableLogin] = useState(false);
  const [filters, setFilters] = useState({
    halal: false,
    vegetarian: false,
    userBooking: false,
    bookings: false,
    quantity: false,
  });
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useGlobalState('user');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [fetchAllRestaurantsFlag, setFetchAllRestaurantsFlag] = useGlobalState('fetchAllRestaurantsFlag');
  const [updateFilteredFlag, setUpdateFilteredFlag] = useState(0);

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

  const fetchData = async () => {
    try {
      let res = await fetchAllRestaurants();
      let restaurants = res.restaurants;
      console.log(res);
      setFilteredRestaurants([]);

      let restaurantsWithDistances = await Promise.all(
        restaurants.map(async (restaurant) => {
          let destination = {
            lat: parseFloat(restaurant.location.latitude),
            lng: parseFloat(restaurant.location.longitude),
          };

          try {
            let distance = await getDistanceRoute(userLocation, destination);
            return {
              ...restaurant,
              distance: distance.value/1000,
              distanceText: distance.text,
            };
          } catch (error) {
            console.error('Error fetching route distance', error);
            return restaurant;
          }
        })
      );

      // Sort restaurants by distance
      restaurantsWithDistances.sort((a, b) => a.distance - b.distance);
      console.log('Restaurants with distances');
      console.log(restaurantsWithDistances);
      setRestaurants(restaurantsWithDistances);

      setUpdateFilteredFlag(updateFilteredFlag + 1);
      setFilters({
        halal: false,
        vegetarian: false,
        userBooking: false,
      });
    } catch (error) {
      console.error('Error fetching restaurants', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchAllRestaurantsFlag, userLocation]);

  const getDistanceRoute = (origin, destination) => {
  return new Promise((resolve, reject) => {
    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const route = result.routes[0];
          const distance = route.legs[0].distance;
          resolve(distance);
        } else {
          reject(`Failed to get directions: ${status}`);
        }
      }
    );
  });
};
useEffect(() => {
  console.log(filters);
  console.log("res", restaurants);

  let filtered = restaurants.filter((restaurant) => {
    return (
      (!filters.halal || restaurant.dietaryOptions.isHalal) &&
      (!filters.vegetarian || restaurant.dietaryOptions.isVegetarian) &&
      (!filters.userBooking || (loggedIn && user && user.bookings && user.bookings.includes(restaurant.id))) &&
      (!filters.bookings || restaurant.bookingCount > 0) &&
      (!filters.quantity || restaurant.quantity > 0)
    );
  });

  if (filters.bookings) {
    filtered.sort((a, b) => b.bookingCount - a.bookingCount);
  } else if (filters.quantity) {
    filtered.sort((a, b) => b.quantity - a.quantity);
  }

  filtered.forEach((restaurant) => {
    generateMarkers(restaurant, setMarkers);
    if (loggedIn && user && user.bookings && user.bookings.includes(restaurant.id)) {
      restaurant.color = 'green';
      restaurant.booked = true;
    }
  });

  setFilteredRestaurants(filtered);

  console.log(filteredRestaurants);
}, [filters, restaurants, updateFilteredFlag]);


  useEffect(() => {
    async function fetchData() {
    if (loggedIn) {
      let res = await fetchUser(user.id);
      console.log(res);
      setUser(res.user);
    }
    
    }
    fetchData();
  }, [fetchAllRestaurantsFlag])

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


  const generateMarkers = (restaurant, setMarkers) => {
    return setMarkers((prev) => [
      ...prev,
      {
        id: restaurant.id,
        position: {
          lat: parseFloat(restaurant.location.latitude),
          lng: parseFloat(restaurant.location.longitude),
        },
        label: restaurant.name,
        color: 'blue',
      },
    ]);

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
          {filteredRestaurants.length && filteredRestaurants.map((restaurant,idx) => (
            <RestaurantBrief key={idx} formData={restaurant} userLocation={userLocation}/>
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
              <label>
                <input
                  type="checkbox"
                  checked={filters.bookings}
                  onChange={() => handleFilterChange('bookings')}
                />
                Bookings
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.quantity}
                  onChange={() => handleFilterChange('quantity')}
                />
                Quantity
              </label>
              {loggedIn &&
                <label>
                  <input
                    type="checkbox"
                    checked={filters.userBooking}
                    onChange={() => handleFilterChange('userBooking')}
                  />
                  User Booking
                </label>
              }
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
          {markers.map((marker,idx) => (
            <Marker
              key={`${marker.id}-${idx}`}
              position={marker.position}
              label={{
                text: marker.label,
                fontSize: '24px',  // Increase the font size here
                backgroundColor: 'white',
              }}
              icon={
                {
                  url: `http://maps.google.com/mapfiles/ms/icons/${marker.color}-dot.png`,
                }
              }
              color={marker.color}
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
