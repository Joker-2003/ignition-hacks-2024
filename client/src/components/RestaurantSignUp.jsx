import React, { useState } from 'react';
import './restaurantSignup.css';

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
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Restaurant added:', formData);
    
    setFormData({
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
    });
  };

  return (
    <div className="container">
      <nav className="navbar">
        <a href="/" className="navbar-brand">RestaurantApp</a>
        <button className="home-button" onClick={() => window.location.href = '/'}>
          Home
        </button>
      </nav>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Restaurant Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Longitude:</label>
          <input type="text" name="location.longitude" value={formData.location.longitude} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Latitude:</label>
          <input type="text" name="location.latitude" value={formData.location.latitude} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Cuisine:</label>
          <input type="text" name="cuisine" value={formData.cuisine} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Booking Count:</label>
          <input type="number" name="bookingCount" value={formData.bookingCount} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" name="dietaryOptions.isHalal" checked={formData.dietaryOptions.isHalal} onChange={handleInputChange} />
            Halal
          </label>
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" name="dietaryOptions.isVegetarian" checked={formData.dietaryOptions.isVegetarian} onChange={handleInputChange} />
            Vegetarian
          </label>
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Operating Hours (Start):</label>
          <input type="time" name="hours.start" value={formData.hours.start} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Operating Hours (End):</label>
          <input type="time" name="hours.end" value={formData.hours.end} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Menu Items:</label>
          {formData.menu.map((item, index) => (
            <div key={index} className="menu-item">
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleMenuChange(index, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" className="add-menu-btn" onClick={handleAddMenuItem}>
            Add Menu Item
          </button>
        </div>

        <button type="submit" className="submit-btn">Save Restaurant</button>
      </form>
    </div>
  );
}
