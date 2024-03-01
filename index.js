const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const connectorRoutes = require('./routes/connectorRoutes');
const dotenv = require('dotenv');

dotenv.config();

let mongoServer;

async function startDatabase() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log('Connected to the in-memory database');
}

function startServer() {
  const app = express();
  app.use(bodyParser.json());

  app.use('/api', connectorRoutes);

  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  return server;
}

function stopServer(server) {
  server.close(() => {
    console.log('Server stopped');
  });
}

async function stopDatabase() {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('Disconnected from the in-memory database');
}

async function main() {
  // Uncomment below two lines if you want to start the server when not running tests
  // await startDatabase();
  // startServer();
}

main();

module.exports = {startServer, stopServer, startDatabase, stopDatabase};
