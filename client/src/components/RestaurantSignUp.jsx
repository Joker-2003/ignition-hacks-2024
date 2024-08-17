import React, { useState } from 'react';

export default function RestaurantSignUp() {
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Mockup data for the restaurants owned by the user
  const mockupRestaurants = [
    {
      id: '1',
      name: 'Restaurant A',
      location: { longitude: '100.00', latitude: '50.00' },
      cuisine: 'Italian',
      phone: '1234567890',
      bookingCount: 5,
      dietaryOptions: { isHalal: true, isVegetarian: false },
      quantity: 20,
      hours: { start: '09:00', end: '21:00' },
      menu: [{ name: 'Pasta' }, { name: 'Pizza' }],
    },
    {
      id: '2',
      name: 'Restaurant B',
      location: { longitude: '101.00', latitude: '51.00' },
      cuisine: 'Chinese',
      phone: '0987654321',
      bookingCount: 10,
      dietaryOptions: { isHalal: false, isVegetarian: true },
      quantity: 30,
      hours: { start: '10:00', end: '22:00' },
      menu: [{ name: 'Noodles' }, { name: 'Dumplings' }],
    },
  ];

  const handleAddRestaurant = () => {
    setIsEditing(false);
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

  const handleEditRestaurant = () => {
    setIsEditing(true);
    setRestaurants(mockupRestaurants);
  };

  const handleRestaurantSelect = (restaurantId) => {
    const restaurant = mockupRestaurants.find((r) => r.id === restaurantId);
    if (restaurant) {
      setFormData(restaurant);
      setSelectedRestaurant(restaurantId);
    }
  };

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
    console.log(formData);
  };

  const handleBack = () => {
    setFormData(null);
    setSelectedRestaurant(null);
  };

  return (
    <div className="container">
      <nav className="navbar">
        <a href="/" className="navbar-brand">RestaurantApp</a>
        <button className="home-button" onClick={() => window.location.href = '/'}>
          Home
        </button>
      </nav>

      {!formData ? (
        <div className="card-container">
          <div className="card" onClick={handleAddRestaurant}>
            Add New Restaurant
          </div>
          <div className="card" onClick={handleEditRestaurant}>
            Edit Existing Restaurant
          </div>
        </div>
      ) : isEditing && !selectedRestaurant ? (
        <div>
          <h2>Select a Restaurant to Edit</h2>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id} onClick={() => handleRestaurantSelect(restaurant.id)}>
                {restaurant.name}
              </li>
            ))}
          </ul>
          <button onClick={handleBack}>Back</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <button onClick={handleBack}>Back</button>

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
      )}
    </div>
  );
}
