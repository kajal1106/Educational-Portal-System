const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan'); // Morgan for logging HTTP requests
const routes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configurations
app.use(cors()); // Configure CORS appropriately if needed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(morgan('tiny')); // Logging HTTP requests in a concise format

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount the API routes
app.use('/', routes);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

// Unhandled Promise Rejections Handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // You can log this to a monitoring service, or do further analysis here
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
