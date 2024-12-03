const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// VTEX API Configuration
const VTEX_API_URL = process.env.VTEX_API_URL;
const headers = {
  'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
  'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN,
};

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the VTEX API server!');
});

// Create a new customer profile
app.post('/api/customers', async (req, res) => {
  const customerData = req.body;

  try {
    const response = await axios.post(
      `${VTEX_API_URL}/api/dataentities/CL/documents`,
      customerData,
      { headers }
    );
    res.status(200).json({
      message: 'Customer profile created successfully.',
      data: response.data,
    });
  } catch (error) {
    console.error('Error creating customer profile:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create customer profile.',
      details: error.response?.data || error.message,
    });
  }
});

// Create a new address
app.post('/api/addresses', async (req, res) => {
  try {
    const response = await axios.post(
      `${VTEX_API_URL}/api/dataentities/AD/documents`,
      req.body,
      { headers }
    );
    res.status(201).json({
      message: 'Address created successfully.',
      data: response.data,
    });
  } catch (error) {
    console.error('Error creating address:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create address.',
      details: error.response?.data || error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
