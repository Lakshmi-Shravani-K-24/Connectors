const express = require('express');
const bodyParser = require('body-parser');
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

module.exports = {
  startServer,
  stopServer,
};


