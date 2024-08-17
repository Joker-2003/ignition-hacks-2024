import React, { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Restaurant added:', formData);
    // Reset form after submission
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
        <div>
          <label>Restaurant Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Longitude:</label>
          <input type="text" name="location.longitude" value={formData.location.longitude} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Latitude:</label>
          <input type="text" name="location.latitude" value={formData.location.latitude} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Cuisine:</label>
          <input type="text" name="cuisine" value={formData.cuisine} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Booking Count:</label>
          <input type="number" name="bookingCount" value={formData.bookingCount} onChange={handleInputChange} required />
        </div>

        <div>
          <label>
            <input type="checkbox" name="dietaryOptions.isHalal" checked={formData.dietaryOptions.isHalal} onChange={handleInputChange} />
            Halal
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" name="dietaryOptions.isVegetarian" checked={formData.dietaryOptions.isVegetarian} onChange={handleInputChange} />
            Vegetarian
          </label>
        </div>

        <div>
          <label>Quantity:</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Operating Hours (Start):</label>
          <input type="time" name="hours.start" value={formData.hours.start} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Operating Hours (End):</label>
          <input type="time" name="hours.end" value={formData.hours.end} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Menu Items:</label>
          {formData.menu.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleMenuChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>

        <button type="submit">Save Restaurant</button>
      </form>
    </div>
  );
}
