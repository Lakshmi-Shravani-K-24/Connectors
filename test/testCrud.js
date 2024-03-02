/* eslint-disable max-len */
const request = require('supertest');
const {expect} = require('chai');
const assert = require('assert');
const mongoose = require('mongoose');
const {before, describe, it, after, beforeEach, afterEach} = require('mocha');
const {startServer, stopServer, startDatabase, stopDatabase} = require('../index');

// Capture console output
let consoleOutput = [];
const originalConsoleLog = console.log;

beforeEach(function() {
  console.log = function(message) {
    consoleOutput.push(message);
  };
});

afterEach(function() {
  console.log = originalConsoleLog; // Restore original console.log
  consoleOutput = []; // Clear console output after each test
});

let objectId;
let app;

before(async () => {
  await startDatabase();
  app = await startServer();
});

after(async () => {
  stopServer(app);
  await stopDatabase();
});

describe('Server and Database Start Tests', function() {
  it('should check if the server is started', function() {
    assert(app, 'Server is not started');
  });

  it('should check if the database is connected', function() {
    const isConnected = mongoose.connection.readyState === 1;
    assert(isConnected, 'Database is not connected');
  });
});

describe('Test Connectors CRUD Operating Routes and funtions ', () => {
  const newConnectorData = {
    connectorId: '123',
    type: 'Type A',
    status: 'Active',
    chargePointId: 'CP001',
    chargeStationName: 'Station 1',
    location: {type: 'Point', coordinates: [-74.0060, 40.7128]},
  };

  it('should create a new connector', async () => {
    const createResponse = await request(app)
        .post('/api/connectors')
        .send(newConnectorData)
        .expect(201);
    assert(createResponse, 'Database is not connected');
    objectId=createResponse.body._id;
    expect(createResponse.body.connectorId).equal(newConnectorData.connectorId);
  });

  it('should get all connectors', async () => {
    const getAllResponse = await request(app)
        .get('/api/connectors')
        .expect(200);
    expect(getAllResponse.body).to.be.an('array').that.is.not.empty;
  });

  it('should get a connector by ID', async () => {
    const getByIdResponse = await request(app)
        .get(`/api/connectors/${objectId}`)
        .expect(200);
    expect(getByIdResponse.body._id).to.equal(objectId);
  });
  it('should get connectors by location', async () => {
    const latitude = 40.7200; // Example latitude
    const longitude = -74.0060; // Example longitude
    const maxDistance = 1000; // Example max distance in meters

    const getByLocationResponse = await request(app)
        .get(`/api/connectors/location/${latitude}/${longitude}/${maxDistance}`)
        .expect(200);
    expect(getByLocationResponse.body).to.be.an('array');
    getByLocationResponse.body.forEach((connector) => {
      expect(connector).to.have.property('location').that.is.an('object').that.has.all.keys('type', 'coordinates');
    });
  });
  it('should update a connector by ID', async () => {
    const updatedConnectorData = {
      type: 'Type B',
      status: 'Inactive',
    };

    const updateResponse = await request(app)
        .put(`/api/connectors/${objectId}`)
        .send(updatedConnectorData)
        .expect(200);
    expect(updateResponse.body).to.deep.include(updatedConnectorData);
  });
  it('should delete a connector by ID', async () => {
    const deleteResponse = await request(app)
        .delete(`/api/connectors/${objectId}`)
        .expect(200);
    assert(deleteResponse, 'Database is not connected');
    expect(deleteResponse.body._id).to.equal(objectId);
  });
});
describe('Test Negative Cases of CRUD Operating Routes and Functions', ()=>{
  it('should return an error if required fields are missing', async () => {
    const invalidConnectorData = {
      connectorId: '121',
      type: 'Type B',
      status: 'Available',
      location: {coordinates: [-22.0060, 61.7100]},
    };
    await request(app)
        .post('/api/connectors')
        .send(invalidConnectorData)
        .expect(400);
  });
  it('should return an error if connectorId is not unique', async () => {
    // Create a connector with the same connectorId
    const connectorDataWithInvalidId = {
      connectorId: '123',
      type: 'Type B',
      status: 'Active',
      chargePointId: 'CP002',
      chargeStationName: 'Station 2',
      location: {coordinates: [1, 1]},
    };
    await request(app)
        .post('/api/connectors')
        .send(connectorDataWithInvalidId)
        .expect(201);
    await request(app)
        .post('/api/connectors')
        .send(connectorDataWithInvalidId)
        .expect(400);
  });
  it('should return an error if connectorId is missing', async () => {
    const connectorDataWithoutId = {
      type: 'Type 2',
      status: 'InActive',
      chargePointId: 'CP003',
      chargeStationName: 'Station 2',
      location: {coordinates: [2, 2]},
    };
    await request(app)
        .post('/api/connectors')
        .send(connectorDataWithoutId)
        .expect(400);
  });
  it('should return  error if connector with given ID is not found', async () => {
    await request(app)
        .get(`/api/connectors/${objectId}`)
        .expect(404);
  });
});
