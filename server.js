const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow requests from different origins (useful during development)

const VTEX_API_URL = process.env.VTEX_API_URL;
const headers = {
  'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
  'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN,
};

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the VTEX API server!');
});

// Route to create a new customer profile
app.post('/api/customers', async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  // Define the payload for the customer profile
  const payload = {
    firstName,
    lastName,
    email,
    phone    
  };

  try {
    // Make POST request to VTEX API
    const response = await axios.post(
      `${VTEX_API_URL}/api/dataentities/CL/documents`,
      payload,
      { headers }
    );

    // Respond with the VTEX response
    res.json(response.data);
  } catch (error) {
    console.error('Error creating customer profile:', error.message);
    res.status(500).json({
      error: 'Failed to create customer profile',
      details: error.response?.data || error.message,
    });
  }
});

// Products in a specific collection route
app.get('/api/collections/:collectionId/products', async (req, res) => {
  const { collectionId } = req.params;

  try {
    const response = await axios.get(
      `${VTEX_API_URL}/api/catalog/pvt/collection/${collectionId}/products`,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products from collection:', error.message);
    res.status(500).json({
      error: 'Failed to fetch products from collection',
      details: error.response?.data || error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
