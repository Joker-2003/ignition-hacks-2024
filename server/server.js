const express = require('express');
const app = express();
const port = 5001;
require('dotenv').config();

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
