const express = require('express');
const bodyParser = require('body-parser');
const connectorRoutes = require('./routes/connectorRoutes');

let server; // Variable to store the server instance

function startServer(port) {
  const app = express();
  app.use(bodyParser.json());

  app.use('/api', connectorRoutes);

  server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  return app;
}

function stopServer() {
  server.close(() => {
    console.log('Server stopped');
  });
}

module.exports = {
  startServer,
  stopServer,
};


