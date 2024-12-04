const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware to parse JSON and handle CORS
app.use(express.json());

// Configure allowed origins for CORS
const allowedOrigins = ['https://vtex-homepage.onrender.com'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

// VTEX API details
const VTEX_API_URL = process.env.VTEX_API_URL;
const headers = {
  'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
  'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN,
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

// Route to create a new address
app.post('/api/addresses', async (req, res) => {
  const {
    addressName,
    addressType,
    city,
    complement,
    country,
    postalCode,
    receiverName,
    reference,
    state,
    street,
    neighborhood,
    number,
    userId,
  } = req.body;

  const addressData = {
    addressName,
    addressType,
    city,
    complement,
    country,
    postalCode,
    receiverName,
    reference,
    state,
    street,
    neighborhood,
    number,
    userId,
  };

  try {
    const response = await axios.post(
      `${VTEX_API_URL}/api/dataentities/AD/documents`,
      addressData,
      { headers }
    );

    res.status(200).json({
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

// Start server on the defined port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
