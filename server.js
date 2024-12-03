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

  // Customer profile payload
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


app.get('/api/customers/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch customer details from your database or VTEX API
    const customer = await getCustomerById(customerId); // Replace with actual function
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer details.' });
  }
});


app.post('/api/addresses', async (req, res) => {
  try {
    const response = await axios.post(
      `${VTEX_API_URL}/api/dataentities/AD/documents`,
      req.body, // Pass the request body to VTEX
      { headers } // Include VTEX API headers
    );
    res.status(201).json({
      message: 'Address created successfully.',
      data: response.data,
    });
  } catch (error) {
    console.error('Error creating address:', error.message);
    res.status(500).json({
      error: 'Failed to create address',
      details: error.response?.data || error.message,
    });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
