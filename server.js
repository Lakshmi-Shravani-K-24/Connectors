const express = require('express');
const bodyParser = require('body-parser');
const {connectToDatabase}=require('./db');
const connectorRoutes = require('./routes/connectorRoutes');

function startServer(port) {
  const app = express();
  app.use(bodyParser.json());

  app.use('/api', connectorRoutes);

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
const PORT=3000;
const MONGO_URL='mongodb://127.0.0.1:27017/ChargeStationDB';

startServer(PORT);
connectToDatabase(MONGO_URL);

module.exports = {
  startServer,
  stopServer,
};


