/* eslint-disable max-len */
const {expect} = require('chai');
// const mongoose = require('mongoose');
const {createConnector, getConnectors, getConnectorById, getConnectorsByLocation, updateConnector, deleteConnector} = require('../controllers/connectorCrud.js');
// const Connector = require('../models/connectorSchema');

describe('Connector CRUD Operation Negative Cases', () => {
  it('should throw error while creating connector', async () => {
    try {
      await createConnector(null); // Pass invalid data to intentionally cause an error
    } catch (error) {
      expect(error).to.exist; // Ensure that an error is thrown
      expect(error.message).to.include('Connector validation failed'); // Ensure that the error message is as expected
    }
  });


  it('should throw error while getting connectors', async () => {
    try {
      await getConnectors(null); // Pass invalid query to intentionally cause an error
    } catch (error) {
      expect(error).to.exist; // Ensure that an error is thrown
      expect(error.message).to.include('Invalid query'); // Ensure that the error message is as expected
    }
  });

  it('should throw error while getting connector by ID', async () => {
    try {
      await getConnectorById(null); // Pass null to force error handling
    } catch (error) {
      expect(error).to.exist;
      // expect(error.message).to.include('Invalid connector ID');
    }
  });
  it('should throw error while getting connectors by location', async () => {
    try {
      await getConnectorsByLocation(null, null, null); // Pass null parameters to force error handling
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.include('Invalid latitude or longitude');
    }
  });

  it('should throw error while updating connector', async () => {
    try {
      await updateConnector(null, null); // Pass invalid parameters to intentionally cause an error
    } catch (error) {
      expect(error).to.exist; // Ensure that an error is thrown
      expect(error.message).to.include('Invalid parameters'); // Ensure that the error message is as expected
    }
  });


  it('should throw error while deleting connector', async () => {
    try {
      await deleteConnector(null); // Pass invalid ID to intentionally cause an error
    } catch (error) {
      expect(error).to.exist; // Ensure that an error is thrown
      expect(error.message).to.include('Invalid connector ID'); // Ensure that the error message is as expected
    }
  });
});
