const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectToDatabase = async (mongoURL) => {
  try {
    await mongoose.connect(mongoURL);
    console.log(mongoURL);
    console.log('Connected to Database');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

// Function to close MongoDB connection
const closeDatabaseConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from Database');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

// Export functions for connecting and disconnecting from the database
module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
};
