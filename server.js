const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'https://vtex-homepage.onrender.com', credentials: true }));

const SECRET_KEY = 'your_secret_key';

// Dummy user data (replace with database logic)
const users = [
  { email: 'test@example.com', password: 'password123', firstName: 'John', lastName: 'Doe' },
];

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Protected profile route
app.get('/api/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    const user = users.find((u) => u.email === decoded.email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ email: user.email, firstName: user.firstName, lastName: user.lastName });
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('VTEX Backend Running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at https://vtex-backend-3.onrender.com/`);
});
