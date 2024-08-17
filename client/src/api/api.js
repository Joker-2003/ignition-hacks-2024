import axios from 'axios';

const URL = 'http://localhost:5000';

export const UserLogin = async (email, id) => {
	try {
		const response = await axios.post(`${URL}/api/users/login`, { email, id: id });
		return response.data;
	} catch (error) {
		throw error;
	}
};