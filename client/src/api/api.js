import axios from 'axios';

const URL = 'http://localhost:5001';

export const UserLogin = async (email, id) => {
	try {
		const response = await axios.post(`${URL}/api/users/login`, { email, id: id });
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const fetchUser = async (id) => {
	try {
		const response = await axios.post(`${URL}/api/users`, { id });
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const addRestaurant = async (restaurant) => {
	try {
		const response = await axios.post(`${URL}/api/restaurants/create`, restaurant);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const fetchAllRestaurants = async () => {
	try {
		const response = await axios.post(`${URL}/api/restaurants/all`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const bookSlot = async (userId, restaurantId) => {
	try {
		const response = await axios.post(`${URL}/api/users/booking/add`, { userId, restaurantId });
		return response.data;
	} catch (error) {
		throw error;
	}
}

export const removeBooking = async (userId, restaurantId) => {
	try {
		const response = await axios.post(`${URL}/api/users/booking/remove`, { userId, restaurantId });
		return response.data;
	} catch (error) {
		throw error;
	}
}