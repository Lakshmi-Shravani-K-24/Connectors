/* eslint-disable max-len */
const Connector = require('../models/connectorSchema');

// Create operation
async function createConnector(connectorData) {
  try {
    const connector = await Connector.create(connectorData);
    return connector;
  } catch (error) {
    console.error('Error creating connector:', error);
    throw error;
  }
}

// Read operation
async function getConnectors() {
  try {
    const connectors = await Connector.find();
    return connectors;
  } catch (error) {
    console.error('Error getting connectors:', error);
    throw error;
  }
}
async function getConnectorById(connectorObjId) {
  try {
    const connector = await Connector.findById(connectorObjId);
    if (!connector) {
      console.log(`Connector with ID ${connectorObjId} not found`);
      return null;
    }
    return connector;
  } catch (error) {
    console.error('Error getting connector by ID:', error);
    throw error;
  }
}

// Update operation
async function updateConnector(connectorObjId, newData) {
  try {
    const updatedConnector = await Connector.findByIdAndUpdate(connectorObjId, newData, {new: true});
    return updatedConnector;
  } catch (error) {
    console.error('Error updating connector:', error);
    throw error;
  }
}

// Delete operation
async function deleteConnector(connectorObjId) {
  try {
    const deletedConnector = await Connector.findByIdAndDelete(connectorObjId);
    return deletedConnector;
  } catch (error) {
    console.error('Error deleting connector:', error);
    throw error;
  }
}

module.exports = {
  createConnector,
  getConnectors,
  getConnectorById,
  updateConnector,
  deleteConnector,
};
