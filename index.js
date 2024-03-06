const express = require('express');
const bodyParser = require('body-parser');
// const {connectToDatabase} = require('./db');
const connectorRoutes = require('./routes/connectorRoutes');
require('dotenv').config();

function startServer() {
  const app = express();
  app.use(bodyParser.json());

  app.use('/api', connectorRoutes);

  const port =3003;
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

// uncomment the below 2 lines and their required dependecies line when running out of tests
// startServer();
// connectToDatabase(process.env.MONGODB_URL);

module.exports = {startServer, stopServer};
