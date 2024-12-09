// Importing required packages
const express = require('express'); // Backend framework
const mongoose = require('mongoose'); // MongoDB object modeling
const dotenv = require('dotenv'); // To load environment variables
const cors = require('cors'); // To handle cross-origin requests
const bodyParser = require('body-parser'); // To parse request body

// Configure dotenv to read .env file
dotenv.config();

// Create an Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable cross-origin requests
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parse form submissions
app.use('/public/uploads', express.static('public/uploads')); // Serve uploaded files

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Default route to check server status
app.get('/', (req, res) => {
  res.send('Welcome to Terravista Backend');
});

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // Auth routes (e.g., signup, login)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
