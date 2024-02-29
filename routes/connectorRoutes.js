const express = require('express');
const router = express.Router();
const {
  createConnector,
  getConnectors,
  getConnectorById,
  updateConnector,
  deleteConnector,
} = require('../controllers/connectorCrud.js');

// Create a new connector

router.post('/connectors', async (req, res) => {
  try {
    const connector = await createConnector(req.body);
    res.status(201).json(connector);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

// Get all connectors
router.get('/connectors', async (req, res) => {
  try {
    const connectors = await getConnectors();
    res.json(connectors);
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Get a connector by ID
router.get('/connectors/:id', async (req, res) => {
  try {
    const connector = await getConnectorById(req.params.id);
    if (!connector) {
      return res.status(404).json({error: 'Connector not found'});
    }
    res.json(connector);
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Update a connector by ID
router.put('/connectors/:id', async (req, res) => {
  try {
    const updatedConnector = await updateConnector(req.params.id, req.body);
    res.json(updatedConnector);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

// Delete a connector by ID
router.delete('/connectors/:id', async (req, res) => {
  try {
    const deletedConnector = await deleteConnector(req.params.id);
    res.json(deletedConnector);
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

module.exports = router;
