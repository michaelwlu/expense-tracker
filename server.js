const path = require('path'); // node.js module for file paths
const express = require('express');
const dotenv = require('dotenv'); // allow global variables
const colors = require('colors'); // customize console messages
const morgan = require('morgan'); // development API use
const connectDB = require('./config/db'); // mongoose DB connection

// Utilize variables in config file
dotenv.config({ path: './config/config.env' });

connectDB();

// Import router
const transactions = require('./routes/transactionsRoute');

// Initialize express app
const app = express();

// Body parser middleware
app.use(express.json());

// Set API routes
app.use('/api/v1/transactions', transactions);

// Use morgan if in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

// Use port number from config
const PORT = process.env.PORT || 5000;

// Start server listening
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
