process.env.MONGO_URL = 'mongodb://127.0.0.1:27017/ChargeStationDB';
const {connectToDatabase, startServer} = require('./serverAndDbStart');

async function establishDatabaseConnection() {
  const connection = await connectToDatabase(process.env.MONGO_URL);
  // if (!connection) {
  //   throw new Error('Failed to connect to the database');
  // }
  return connection;
}

async function main() {
  const dbConnection = await establishDatabaseConnection();
  const PORT = 3000;
  const server = startServer(PORT);
  return {server, dbConnection}; // Return both server and database connection
}

module.exports = main(); // Call main function and export its results
