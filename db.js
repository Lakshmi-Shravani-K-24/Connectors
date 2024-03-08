const mongoose = require('mongoose');

const connectToDatabase = async (mongoURL) => {
  await mongoose.connect(mongoURL);
  console.log(mongoURL);
  console.log('Connected to Database');
};

// Function to close MongoDB connection
const closeDatabaseConnection = async () => {
  await mongoose.connection.close();
  console.log('Disconnected from Database');
};

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
};
