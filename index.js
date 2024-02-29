const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const connectorRoutes = require('./routes/connectorRoutes.js');
const dotenv = require('dotenv');

dotenv.config();

// Initialize the MongoDB in-memory server
async function startDatabase() {
  const mongod = new MongoMemoryServer();
  await mongod.start();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log('Connected to the in-memory database');
}

// Start the Express server
function startServer() {
  const app = express();
  app.use(bodyParser.json());

  app.use('/api', connectorRoutes);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  return app; // Return the app object
}

// Start the application
async function main() {
  try {
    await startDatabase();
    // startServer(); use when  running outside of tests
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
main();

module.exports = startServer; // Export the startServer function
