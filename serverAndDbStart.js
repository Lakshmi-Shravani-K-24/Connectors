const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const connectorRoutes = require('./routes/connectorRoutes');

const connectToDatabase = async (mongoURL) => {
  await mongoose.connect(mongoURL);
  console.log('Connected to Database');
  return mongoose.connection;
};

const app = express();
function startServer(port) {
  app.use(bodyParser.json());

  app.use('/api', connectorRoutes);

  const server=app.listen(port, () => {
    console.log( `Server is listening on port ${port}`);
  });

  return server;
}

module.exports = {
  connectToDatabase,
  startServer,
};
