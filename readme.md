# ShareBite

ShareBite is a web application designed to address the growing issues of food waste and hunger by connecting restaurants with surplus food to users in need. Through this platform, restaurants can efficiently redistribute their surplus food, and users can access nutritious meals that might otherwise go to waste.

## Table of Contents

1. [Inspiration](#inspiration)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [How It Works](#how-it-works)
5. [Setup and Installation](#setup-and-installation)
6. [API Endpoints](#api-endpoints)
7. [Challenges and Accomplishments](#challenges-and-accomplishments)
8. [Future Enhancements](#future-enhancements)
9. [Contributing](#contributing)

## Inspiration

The inspiration behind ShareBite stems from the increasing issue of food waste and hunger within our communities. Many restaurants end up with surplus food at the end of the day, while there are numerous individuals and families struggling to access nutritious meals. ShareBite aims to bridge this gap by facilitating the efficient redistribution of surplus food to those in need.

## Features

- **Real-Time Updates**: Surplus food items uploaded by restaurants are instantly visible to users.
- **Location-Based Sorting**: Restaurants are sorted by proximity, helping users find the nearest options.
- **Dietary Restriction Filters**: Users can filter restaurants based on dietary restrictions (e.g., halal, vegetarian, vegan).
- **Dynamic Map Integration**: Integrated with Google Maps API to provide directions to selected restaurants.
- **Visual Radius Indicators**: Color-coded circles on the map highlight restaurants within specific distances.
- **Detailed Restaurant Profiles**: Users can view detailed information about each restaurant, including cuisine type, available quantity, dietary options, and operational hours. Users can also book pickup times directly through the app.

## Technologies Used

- **Frontend**: 
  - **React**: For building the dynamic and responsive user interface.
  - **Chakra-UI**: For a consistent and accessible design system.
- **Backend**:
  - **Node.js** & **Express**: For server-side logic and API development.
  - **MongoDB**: For data storage.
  - **Mongoose**: For object modeling and schema validation.
- **APIs**:
  - **Google Maps API**: For location and distance calculations.

## How It Works

### Frontend

- **React**: Utilizes React's component-based architecture for a dynamic user interface.
- **User Authentication**: Google Sign-In is used for secure login.
- **Restaurant Information Form**: Allows restaurant owners to input details about their surplus food.

### Backend

- **Node.js & Express**: Handles server-side logic and API requests.
- **MongoDB**: Stores user and restaurant data.
- **Mongoose**: Manages schemas for users and restaurants.

### Real-Time Updates

- **Data Synchronization**: Ensures that new restaurant data and bookings are immediately reflected to users.

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/sharebite.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd sharebite
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create a `.env` file** in the root directory and add your MongoDB URI:

   ```plaintext
   MONGO_URI=your_mongodb_uri
   ```

5. **Start the server**:

   ```bash
   npm start
   ```

   The server will run on port `5001`.

## API Endpoints

### User Endpoints

- **Create or Find User**:
  - **POST** `/api/users/login`
  - **Body**: `{ "id": "user_id", "email": "user_email" }`
  - **Response**: `User found or created successfully`

- **Add Booking**:
  - **POST** `/api/users/booking/add`
  - **Body**: `{ "userId": "user_id", "restaurantId": "restaurant_id", "restaurantName": "restaurant_name" }`
  - **Response**: `Booking added successfully`

- **Remove Booking**:
  - **POST** `/api/users/booking/remove`
  - **Body**: `{ "userId": "user_id", "restaurantId": "restaurant_id" }`
  - **Response**: `Booking removed successfully`

- **Get User**:
  - **POST** `/api/users`
  - **Body**: `{ "id": "user_id" }`
  - **Response**: `User found`

### Restaurant Endpoints

- **Create Restaurant**:
  - **POST** `/api/restaurants/create`
  - **Body**: `{ "userid": "user_id", "name": "restaurant_name", ... }`
  - **Response**: `Restaurant created successfully`

- **Update Restaurant**:
  - **POST** `/api/restaurants/update`
  - **Body**: `{ "userid": "user_id", "id": "restaurant_id", ... }`
  - **Response**: `Restaurant updated successfully`

- **Get Restaurant by ID**:
  - **GET** `/api/restaurants/:id`
  - **Response**: `Restaurant found`

- **Get All Restaurants**:
  - **POST** `/api/restaurants/all`
  - **Response**: `List of restaurants`

- **Delete Restaurant**:
  - **GET** `/api/restaurants/delete/:id`
  - **Response**: `Restaurant deleted successfully`

## Challenges and Accomplishments

### Challenges

- **Data Synchronization**: Ensuring consistency between user inputs and restaurant data in MongoDB.
- **Map Integration**: Handling accurate distance calculations and real-time location updates with Google Maps API.
- **UI/UX Design**: Creating an intuitive interface that connects restaurant owners and users effectively.

### Accomplishments

- Developed a fully functional platform that addresses food waste.
- Integrated Google Maps API for real-time location data.
- Created a user-friendly interface for seamless navigation and interactions.

## Future Enhancements

- **Monetization**: Introducing advertisements to generate revenue while keeping the service free for users.
- **Expanding Features**: Adding detailed analytics for restaurants to track their impact on reducing food waste.
- **Mobile Application**: Developing a mobile version to increase accessibility and user engagement.
