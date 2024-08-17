const express = require('express');
const app = express();
const port = 5001;
require('dotenv').config();
const db = require('./db');
const cors = require('cors');
const nanoid = require('nanoid');
const RestaurantSchema = require('./Schema/Restaurant.Schema');

app.use(express.json());

let DB;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

/***************************  USER  *****************************/





/************************* RESTAURANT ROUTES ***************************/

// Create a new restaurant
app.post('/api/restaurants/create', async (req, res) => {
	const { name, location, phone, cuisine, hours, menu, bookingCount, dietaryOptions, quantity } = req.body;
	const id = nanoid.nanoid();
	let restaurant = new RestaurantSchema({
		id: id,
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
	try{
		let result = await DB.collection('restaurants').insertOne(restaurant);
		res.status(200).json({ message: 'Restaurant created successfully', restaurant: restaurant });
	}
	catch(err){
		res.status(500).json({ error: 'Failed to create restaurant', err: err });
	}


});

// Update an existing restaurant
app.post('/api/restaurants/update', async (req, res) => { 
	const { id, name, location, phone, cuisine, hours, menu, bookingCount, dietaryOptions, quantity } = req.body;
	let restaurant = new RestaurantSchema({
		id: id,
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
	try{
		let result = await DB.collection('restaurants').updateOne({id: id}, {$set: restaurant});
		res.status(200).json({ message: 'Restaurant updated successfully', restaurant: restaurant });
	}
	catch(err){
		res.status(500).json({ error: 'Failed to update restaurant', err: err });
	}
});

// Get a restaurant by ID
app.get('/api/restaurants/:id', async (req, res) => {
	const id = req.params.id;
	try{
		let result = await DB.collection('restaurants').findOne({id: id});
		res.status(200).json({ message: 'Restaurant found', restaurant: result });
	}
	catch(err){
		res.status(500).json({ error: 'Failed to find restaurant', err: err });
	}
});

// Get all restaurants
app.get('/api/restaurants/all', async (req, res) => {
	try{
		let result = await DB.collection('restaurants').find().toArray();
		res.status(200).json({ message: 'Restaurants found', restaurants: result });
	}
	catch(err){
		res.status(500).json({ error: 'Failed to find restaurants', err: err });
	}
 });

// Delete a restaurant
app.get('/api/restaurants/delete/:id', async (req, res) => {
	const id = req.params.id;
	try{
		let result = await DB.collection('restaurants').deleteOne({id: id});
		res.status(200).json({ message: 'Restaurant deleted successfully' });
	}
	catch(err){
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