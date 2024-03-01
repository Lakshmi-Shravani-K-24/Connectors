/* eslint-disable complexity */
/* eslint-disable max-len */
const Connector = require('../models/connectorSchema');

// Create operation
async function createConnector(connectorData) {
  try {
    const connector = await Connector.create(connectorData);
    return connector;
  } catch (error) {
    console.error('Error creating connector:', error.message);
    throw error;
  }
}

async function getConnectors(query) {
  try {
    // Simulate an error by passing an invalid query
    if (!query) {
      throw new Error('Invalid query');
    }
    const connectors = await Connector.find(query);
    return connectors;
  } catch (error) {
    console.error('Error getting connectors:', error.message);
    throw error;
  }
}
async function getConnectorById(connectorObjId) {
  try {
    const connector = await Connector.findById(connectorObjId);
    // Force error handling by throwing an error if the ID is null
    if (!connectorObjId) {
      throw new Error('Invalid connector ID');
    }
    if (!connector) {
      return null;
    }
    return connector;
  } catch (error) {
    console.error('Error getting connector by ID:', error.message);
    throw error;
  }
}

async function getConnectorsByLocation(latitude, longitude, maxDistance) {
  try {
    // Force error handling by throwing an error if latitude or longitude is null
    if (!latitude || !longitude) {
      throw new Error('Invalid latitude or longitude');
    }
    const connectors = await Connector.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    });
    return connectors;
  } catch (error) {
    console.error('Error getting connectors by location:', error.message);
    throw error;
  }
}

// Update operation
async function updateConnector(connectorObjId, newData) {
  try {
    // Simulate an error by passing null parameters
    if (!connectorObjId || !newData) {
      throw new Error('Invalid parameters');
    }
    const updatedConnector = await Connector.findByIdAndUpdate(connectorObjId, newData, {new: true});
    return updatedConnector;
  } catch (error) {
    console.error('Error updating connector:', error.message);
    throw error;
  }
}

async function deleteConnector(connectorObjId) {
  try {
    // Simulate an error by passing an invalid connector ID
    if (!connectorObjId) {
      throw new Error('Invalid connector ID');
    }
    const deletedConnector = await Connector.findByIdAndDelete(connectorObjId);
    return deletedConnector;
  } catch (error) {
    console.error('Error deleting connector:', error.message);
    throw error;
  }
}

module.exports = {
  createConnector,
  getConnectors,
  getConnectorById,
  getConnectorsByLocation,
  updateConnector,
  deleteConnector,
};
