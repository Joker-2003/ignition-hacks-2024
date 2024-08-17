const express = require('express');
const app = express();
const port = 5001;
require('dotenv').config();
const db = require('./db');
const cors = require('cors');
const RestaurantSchema = require('./Schema/Restaurant.Schema');
const UserSchema = require('./Schema/User.Schema');

app.use(cors());
app.use(express.json());

let DB;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

/***************************  USER  *****************************/

// Create a new user
app.post('/api/users/login', async (req, res) => {
	const { id, email } = req.body;
	
		let user = await DB.collection('users').findOne({
			id: id
		});
		if (user) {
			res.status(200).json({ message: 'User found', user: user });
		} else {

			let user = new UserSchema({
				id: id,
				email: email,
				bookings: [],
				restaurantAdded: []
			});
			try {
				let result = await DB.collection('users').insertOne(user);
				res.status(200).json({ message: 'User created successfully', user: user });
			}
			catch (err) {
				res.status(500).json({ error: 'Failed to create user', err: err });
			}
		}

});

app.post('/api/users/booking/add', async (req, res) => {
	const { userId, restaurantId, restaurantName } = req.body;
	try {
		let result = await DB.collection('users').updateOne({ id: userId }, { $push: { bookings: { restaurantId: restaurantId, restaurantName: restaurantName } } });
		let result2 = await DB.collection('restaurants').updateOne({ id: restaurantId }, { $inc: { bookingCount: 1 } });
		res.status(200).json({ message: 'Booking added successfully' });
	}
	catch (err) {
		res.status(500).json({ error: 'Failed to add booking', err: err });
	}
});

app.post('/api/users/booking/remove', async (req, res) => {
	const { userId, restaurantId } = req.body;
	try {
		let result = await DB.collection('users').updateOne({ id: userId }, { $pull: { bookings: { restaurantId: restaurantId } } });
		let result2 = await DB.collection('restaurants').updateOne({ id: restaurantId }, { $inc: { bookingCount: -1 } });
		res.status(200).json({ message: 'Booking removed successfully' });
	}
	catch (err) {
		res.status(500).json({ error: 'Failed to remove booking', err: err });
	}
})

app.get('/api/users/:id', async (req, res) => {
	const id = req.params.id;
	try {
		let result = await DB.collection('users').findOne({ id: id });
		res.status(200).json({ message: 'User found', user: result });
	}
	catch (err) {
		res.status(500).json({ error: 'Failed to find user', err: err });
	}
}
);



/************************* RESTAURANT ROUTES ***************************/

// Create a new restaurant
app.post('/api/restaurants/create', async (req, res) => {
	const { userid, name, location, phone, cuisine, address, hours, menu, bookingCount, dietaryOptions, quantity } = req.body;
	const id = Math.random().toString(36).substr(2, 9);
	let restaurant = new RestaurantSchema({
		id: id,
		userid: userid,
		name: name,
		location: location,
		phone: phone,
		cuisine: cuisine,
		hours: hours,
		menu: menu,
		bookingCount: bookingCount,
		dietaryOptions: dietaryOptions,
		quantity: quantity,
		address: address
	});
	try {
		let result = await DB.collection('restaurants').insertOne(restaurant);
		res.status(200).json({ message: 'Restaurant created successfully', restaurant: restaurant });
	}
	catch (err) {
		res.status(500).json({ error: 'Failed to create restaurant', err: err });
	}


});

// Update an existing restaurant
app.post('/api/restaurants/update', async (req, res) => {
	const { userid, id, name, location, phone, cuisine, hours, menu, bookingCount, dietaryOptions, quantity } = req.body;
	let restaurant = new RestaurantSchema({
		id: id,
		userid: userid,
		name: name,
		location: location,
		phone: phone,
		cuisine: cuisine,
		hours: hours,
		menu: menu,
		bookingCount: bookingCount,
		dietaryOptions: dietaryOptions,
		quantity: quantity
	});
	try {
		let result = await DB.collection('restaurants').updateOne({ id: id }, { $set: restaurant });
		res.status(200).json({ message: 'Restaurant updated successfully', restaurant: restaurant });
	}
	catch (err) {
		res.status(500).json({ error: 'Failed to update restaurant', err: err });
	}
});

// Get a restaurant by ID
app.get('/api/restaurants/:id', async (req, res) => {
	const id = req.params.id;
	try {
		let result = await DB.collection('restaurants').findOne({ id: id });
		res.status(200).json({ message: 'Restaurant found', restaurant: result });
	}
	catch (err) {
		res.status(500).json({ error: 'Failed to find restaurant', err: err });
	}
});

// Get all restaurants
app.get('/api/restaurants/all', async (req, res) => {
	console.log('Finding restaurants');
	try {
		console.log('Finding restaurants');
		let result = await DB.collection('restaurants').find().toArray();
		console.log(result);
		res.status(200).json({ message: 'Restaurants found', restaurants: result });
	}
	catch (err) {
		res.status(500).json({ error: 'Failed to find restaurants', err: err });
	}
});

// Delete a restaurant
app.get('/api/restaurants/delete/:id', async (req, res) => {
	const id = req.params.id;
	try {
		let result = await DB.collection('restaurants').deleteOne({ id: id });
		res.status(200).json({ message: 'Restaurant deleted successfully' });
	}
	catch (err) {
		res.status(500).json({ error: 'Failed to delete restaurant', err: err });
	}

});



app.listen(port, async () => {
	try {
		db.connectToServer();

		DB = db.getDb();
		console.log("Connected to MongoDB");

		// Ensure the database is connected before handling requests
		app.use((req, res, next) => {
			if (!DB) {
				return res.status(500).json({ error: 'Database connection not established' });
			}
			next();
		});

		console.log(`Server is running on port ${port}`);
	} catch (err) {
		console.error('Failed to connect to MongoDB:', err);
	}
});