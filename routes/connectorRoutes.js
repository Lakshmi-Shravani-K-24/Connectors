/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const {
  createConnector,
  getConnectors,
  getConnectorById,
  getConnectorsByLocation,
  updateConnector,
  deleteConnector,
} = require('../controllers/connectorCrud.js');

// Create a new connector
router.post('/connectors', async (req, res) => {
  try {
    const createdconnector = await createConnector(req.body);
    res.status(201).json(createdconnector);
  } catch (error) {
    res.status(400).json({'error': error.message, 'Invalid data': req.body});
  }
});
// Get all connectors
router.get('/connectors', async (req, res) => {
  try {
    const allconnectors = await getConnectors({});
    res.json(allconnectors);
  } catch (error) {
    // res.status(500).json({error: 'Internal Server Error. Cannot get connectors'});
  }
});
// Get a connector by ID
router.get('/connectors/:id', async (req, res) => {
  try {
    const connector = await getConnectorById(req.params.id);
    if (!connector) {
      console.log('Connector not found');
      return res.status(404).json({error: 'Connector not found'});
    }
    res.json(connector);
  } catch (error) {
    // res.status(500).json({error: 'Internal Server Error. Cannot get a connector by ID'});
  }
});
// Get connectors by location
router.get('/connectors/location/:latitude/:longitude/:maxDistance', async (req, res) => {
  try {
    const latitude = parseFloat(req.params.latitude);
    const longitude = parseFloat(req.params.longitude);
    const maxDistance = parseInt(req.params.maxDistance);

    const connectorsNearGivenLocation = await getConnectorsByLocation(latitude, longitude, maxDistance);
    res.json(connectorsNearGivenLocation);
  } catch (error) {
    // res.status(500).json({error: 'Internal Server Error. Cannot get connectors by location'});
  }
});
// Update a connector by ID
router.put('/connectors/:id', async (req, res) => {
  try {
    const updatedConnector = await updateConnector(req.params.id, req.body);
    res.json(updatedConnector);
  } catch (error) {
    // res.status(400).json({error: error.message});
  }
});
// Delete a connector by ID
router.delete('/connectors/:id', async (req, res) => {
  try {
    const deletedConnector = await deleteConnector(req.params.id);
    res.json(deletedConnector);
  } catch (error) {
    // res.status(500).json({error: 'Internal Server Error. Cannot delete connector'});
  }
});
module.exports = router;
