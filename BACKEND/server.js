require('dotenv').config(); 
const app = require('./src/app');
const connectDB = require('./src/config/database');
const express = require('express'); // Added to use express.static
const path = require('path');       // Added to resolve file paths safely
const app2 = require('./src/app');


connectDB();

const frontendDist = path.join(__dirname, '../FRONTEND/dist');
app.use(express.static(frontendDist));

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app2.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



