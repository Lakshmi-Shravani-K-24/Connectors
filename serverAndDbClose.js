const mongoose = require('mongoose');
const dropDatabase = async () => {
  await mongoose.connection.dropDatabase();
  console.log('Database dropped successfully');
};

const closeDatabaseConnection = async () => {
  await mongoose.connection.close();
  console.log('Disconnected from Database');
};

function stopServer(app) {
  app.close(() => {
    console.log('Server stopped');
  });
}


module.exports = {
  dropDatabase,
  closeDatabaseConnection,
  stopServer,
};
