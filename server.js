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
