import React from 'react';
import './restaurantCardDetail.css';

const RestaurantCardDetail = ({ formData }) => {
  const {
    id,
    name,
    address,
    location,
    cuisine,
    phone,
    bookingCount,
    dietaryOptions,
    quantity,
    hours,
    menu,
	distance
  } = formData;

  return (
    <div className="restaurant-card">
      <h2 className="restaurant-card-title">{name}</h2>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Latitude:</strong> {location.latitude}</p>
      <p><strong>Longitude:</strong> {location.longitude}</p>
      <p><strong>Cuisine:</strong> {cuisine}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>Booking Count:</strong> {bookingCount}</p>
	  <p><strong>Distance:</strong> {distance}</p>
      <p><strong>Dietary Options:</strong> 
        {dietaryOptions.isHalal ? 'Halal ' : ''} 
        {dietaryOptions.isVegetarian ? 'Vegetarian ' : ''}
      </p>
      <p><strong>Quantity:</strong> {quantity}</p>
      <p><strong>Distribution Hours:</strong> {hours.start} - {hours.end}</p>
      <div>
        <strong>Menu:</strong>
        <ul>
          {menu.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      </div>
	  <button className="btn btn-primary">Book Now</button>
    </div>
  );
};

export default RestaurantCard;
