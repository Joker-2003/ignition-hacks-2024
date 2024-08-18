import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';
import './restaurantSignup.css';
import { addRestaurant } from '../api/api';
import { useGlobalState } from '../App';
import { useNavigate } from 'react-router-dom';

const libraries = ['places'];

export default function RestaurantSignUp() {
  const [formData, setFormData] = useState({
    id: '',
    userid: '',
    name: '',
    location: { longitude: '', latitude: '' },
    cuisine: '',
    phone: '',
    bookingCount: 0,
    dietaryOptions: { isHalal: false, isVegetarian: false },
    quantity: 0,
    hours: { start: '', end: '' },
    menu: [{ name: '' }],
    address: '',
  });

  const navigate = useNavigate();
  const [user, setUser] = useGlobalState('user');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const autocompleteRef = useRef(null);

  const [disableSubmit, setDisableSubmit] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
    libraries,
  });

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      setFormData((prevData) => ({
        ...prevData,
        address: place.formatted_address,
        location: {
          latitude: lat(),
          longitude: lng(),
        },
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name.includes('.')) {
      const [mainKey, subKey] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        [mainKey]: {
          ...prevData[mainKey],
          [subKey]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleMenuChange = (index, value) => {
    const newMenu = [...formData.menu];
    newMenu[index].name = value;
    setFormData((prevData) => ({
      ...prevData,
      menu: newMenu,
    }));
  };

  const handleAddMenuItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      menu: [...prevData.menu, { name: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    setDisableSubmit(true);
    e.preventDefault();
    console.log('Restaurant added:', formData);
    try {
      let res = await addRestaurant(formData);
      console.log(res);
      // Handle success case
    } catch (err) {
      console.error(err);
      // Handle error case
    }
    setDisableSubmit(false);
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1 style={{fontSize:"30px"}}>Restaurant Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Restaurant Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
              required
            />
          </Autocomplete>
        </div>

        <div className="form-group">
          <label>Longitude:</label>
          <input
            type="text"
            name="location.longitude"
            value={formData.location.longitude}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Latitude:</label>
          <input
            type="text"
            name="location.latitude"
            value={formData.location.latitude}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cuisine:</label>
          <input
            type="text"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Booking Count:</label>
          <input
            type="number"
            name="bookingCount"
            value={formData.bookingCount}
            onChange={handleInputChange}
            required
          />
        </div>

        <fieldset>
          <legend>Dietary Restrictions</legend>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="dietaryOptions.isHalal"
                checked={formData.dietaryOptions.isHalal}
                onChange={handleInputChange}
              />
              Halal
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="dietaryOptions.isVegetarian"
                checked={formData.dietaryOptions.isVegetarian}
                onChange={handleInputChange}
              />
              Vegetarian
            </label>
          </div>
        </fieldset>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Operating Hours (Start):</label>
          <input
            type="time"
            name="hours.start"
            value={formData.hours.start}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Operating Hours (End):</label>
          <input
            type="time"
            name="hours.end"
            value={formData.hours.end}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Menu Items:</label>
          {formData.menu.map((item, index) => (
            <div key={index} className="menu-item">
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleMenuChange(index, e.target.value)}
                placeholder="Menu item name"
                required
              />
            </div>
          ))}
          <button type="button" className="add-menu-btn" onClick={handleAddMenuItem}>
            Add Menu Item
          </button>
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn" disabled={disableSubmit}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
