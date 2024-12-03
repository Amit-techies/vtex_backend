const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Default to port 5000 if not specified

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS), useful during development

// VTEX API URL and headers
const VTEX_API_URL = process.env.VTEX_API_URL; // Base URL for VTEX API
const headers = {
  'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,  // API Key
  'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN,  // API Token
};

// Root route to check server status
app.get('/', (req, res) => {
  res.send('Welcome to the VTEX API server!');
});

// Route to create a new customer profile
app.post('/api/customers', async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    phone,
    documentType,
    document,
    isCorporate,
    isNewsletterOptIn,
    localeDefault,
  } = req.body;

  // Payload for creating customer profile
  const customerData = {
    email,
    firstName,
    lastName,
    phone,
    documentType,
    document,
    isCorporate,
    isNewsletterOptIn,
    localeDefault,
  };

  try {
    // Sending request to VTEX API to create customer
    const response = await axios.post(
      `${VTEX_API_URL}/api/dataentities/CL/documents`,
      customerData, // Customer data
      { headers }
    );

    // Send success response with customer data
    res.status(200).json({
      message: 'Customer profile created successfully.',
      data: response.data,
    });
  } catch (error) {
    // Handle errors and log details
    console.error('Error creating customer profile:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create customer profile.',
      details: error.response?.data || error.message,
    });
  }
});

// Route to get customer profile by ID (example for retrieval)
app.get('/api/customers/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch customer details from VTEX API or your database
    const response = await axios.get(
      `${VTEX_API_URL}/api/dataentities/CL/documents/${customerId}`,
      { headers }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching customer details:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch customer details.' });
  }
});

// Route to create a new customer address
app.post('/api/addresses', async (req, res) => {
  const {
    addressName,
    addressType,
    city,
    state,
    country,
    postalCode,
    receiverName,
    street,
    number,
    userId, // Assuming userId is customerId from customer profile
  } = req.body;

  const addressData = {
    addressName,
    addressType,
    city,
    state,
    country,
    postalCode,
    receiverName,
    street,
    number,
    userId,
  };

  try {
    // Sending request to VTEX API to create an address
    const response = await axios.post(
      `${VTEX_API_URL}/api/dataentities/AD/documents`,
      addressData, // Address data
      { headers }
    );

    // Send success response with address data
    res.status(201).json({
      message: 'Address created successfully.',
      data: response.data,
    });
  } catch (error) {
    // Handle errors and log details
    console.error('Error creating address:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create address.',
      details: error.response?.data || error.message,
    });
  }
});

// Start server and listen for requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
