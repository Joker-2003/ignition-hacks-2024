import React, {useState} from 'react'
import { useGlobalState } from '../App';
import { bookSlot,  removeBooking } from '../api/api';

export default function RestaurantBrief({ formData }, userLocation) {
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
      hours, booked
    } = formData;

	const [directions, setDirections] = useGlobalState('directions');
	const [user, setUser] = useGlobalState('user');
	const [fetchAllRestaurantsFlag, setFetchAllRestaurantsFlag] = useGlobalState('fetchAllRestaurantsFlag');
	const [disabled, setDisabled] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
	const [directionDetails, setDirectionDetails] = useGlobalState('directionDetails');
	const [travelMode, setTravelMode] = useGlobalState('travelMode');

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

    const handleCancelBooking = async () => {
      if (user) {
        console.log("Cancel Booking");
        let res = await removeBooking(user.id, id);
        console.log(res);
        setFetchAllRestaurantsFlag(fetchAllRestaurantsFlag + 1);
      }
      else {
        console.log("Cancel Booking");
        setForceUpdate(!forceUpdate);
      }
    };

    const handleBookNow = async () => {
      if (user) {
        console.log("Book Now");
        try {
          let res = await bookSlot(user.id, id);
          console.log(res);
          setFetchAllRestaurantsFlag(fetchAllRestaurantsFlag + 1);
        }
        catch (err) {
          console.log(err);
        }

      }
      
      setForceUpdate(!forceUpdate);
    };

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
          {booked ?
            <button title={!user ? 'Login to cancel' : ''} disabled={!user || disabled} onClick={handleCancelBooking} className="btn btn-danger">Cancel Booking</button>
            :
            (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  onClick={handleBookNow}
                  disabled={!user}
                  className="btn btn-primary"
                  aria-label="Book Now"
                >
                  {user ? "Book Now" : "Login to Book"}
                </button>

              </div>
            )
          }
          <button className="btn btn-secondary" onClick={handleDirectionsClick}>Get Directions</button>
        </div>
      </div>
    );
  };
