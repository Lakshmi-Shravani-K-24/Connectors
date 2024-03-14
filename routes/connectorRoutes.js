/* eslint-disable complexity */
/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const axios = require('axios');

const {
  createConnector,
  getConnectors,
  getConnectorById,
  getConnectorByConnectorId,
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
  res.json(await getConnectors({}));
});

// Get a connector by ID
router.get('/connectors/:id', async (req, res) => {
  const getConnectorByIdResponse = await getConnectorById(req.params.id);
  if (!getConnectorByIdResponse) {
    console.log('Connector not found');
    return res.status(404).json({error: 'Connector not found'});
  }
  res.json(getConnectorByIdResponse);
});

router.get('/connectors/connectorId/:connectorId', async (req, res) => {
  const getConnectorByConnectorIdResponse = await getConnectorByConnectorId(req.params.connectorId);
  if (!getConnectorByConnectorIdResponse) {
    return res.status(404).json({error: 'Connector not found'});
  }
  res.json(getConnectorByConnectorIdResponse);
});

// Get connectors by location
router.get('/connectors/location/:latitude/:longitude/:maxDistance', async (req, res) => {
  const latitude = parseFloat(req.params.latitude);
  const longitude = parseFloat(req.params.longitude);
  const maxDistance = parseInt(req.params.maxDistance);

  const connectorsNearGivenLocation = await getConnectorsByLocation(latitude, longitude, maxDistance);
  res.json(connectorsNearGivenLocation);
});

// Update a connector by ID
router.put('/connectors/:id', async (req, res) => {
  res.json(await updateConnector(req.params.id, req.body));
});

// Delete a connector by ID
router.delete('/connectors/:id', async (req, res) => {
  res.json(await deleteConnector(req.params.id));
});

router.get('/connectors/chargingTime/:connectorId', async (req, res) => {
  try {
    const {batteryCapacityInKiloWattPerHour, socInPercentage, connectorId} = req.query;

    if (!batteryCapacityInKiloWattPerHour || !socInPercentage || !connectorId ) {
      throw new Error('Incomplete data. Please provide all required parameters.');
    }

    const connector = await getConnectorByConnectorId(connectorId);
    if (!connector) {
      return res.status(404).json({error: 'Connector not found.'});
    }

    const {connectorPowerInKiloWatt} = connector; // Extract connectorPowerInKiloWatt from connector
    let estimatedTime;
    try {
      const response = await axios.get('http://localhost:3001/connectors/estimatedChargingTime', {
        params: {
          connectorPowerInKiloWatt,
          batteryCapacityInKiloWattPerHour,
          socInPercentage,
        },
        timeout: 5000,
      });
      estimatedTime = response.data.estimatedTimeInMinutes;
    } catch (error) {
      throw new Error('Internal Server Error: Estimation server is not working properly');
    }

    const result = {
      connectorDetails: connector,
      batteryDetails: {socInPercentage,
        batteryCapacityInKiloWattPerHour,
      },
      estimatedChargingTimeInMinutes: estimatedTime,
    };
    res.json(result);
  } catch (error) {
    if (error.message.startsWith('Incomplete data')) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: error.message});
    }
  }
});

module.exports = router;

