const express = require('express');
const app = express();
const port = 5001;
require('dotenv').config();

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});

/***************************  USER  *****************************/





 /************************* RESTAURANT ROUTES ***************************/

 // Create a new restaurant
app.post('/api/restaurants/create', async (req, res) => {}); 

// Update an existing restaurant
app.post('/api/restaurants/update', async (req, res) => {});

// Get a restaurant by ID
app.get('/api/restaurants/:id', async (req, res) => {});

// Get all restaurants
app.get('/api/restaurants/all', async (req, res) => {});

// Delete a restaurant
app.post('/api/restaurants/delete', async (req, res) => {});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
