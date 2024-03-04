/* eslint-disable max-len */
const request = require('supertest');
const {expect} = require('chai');
const assert = require('assert');
const sinon = require('sinon');
const mongoose = require('mongoose');
const {before, describe, it, after} = require('mocha');
const {startServer, stopServer} = require('../index');
const {connectToDatabase, closeDatabaseConnection} = require('../db');
const {MongoMemoryServer} = require('mongodb-memory-server');
require('dotenv').config();

let mongoServer;
let objectId;
let app;
let consoleLogStub;

before(async () => {
  consoleLogStub = sinon.stub(console, 'log');
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URL = mongoUri;
  await connectToDatabase(process.env.MONGODB_URL);
  app = startServer();
});

after(async () => {
  consoleLogStub = sinon.stub(console, 'log');
  stopServer(app);
  await closeDatabaseConnection();
  await mongoServer.stop();
  // Reset process.env.MONGODB_URL to the real MongoDB URL from .env file
  process.env.MONGODB_URL = 'mongodb://localhost:27017/mydatabase';
  consoleLogStub.restore();

  // Assertions for server and database stopped messages
  sinon.assert.calledWith(consoleLogStub, 'Server stopped');
  sinon.assert.calledWith(consoleLogStub, 'Disconnected from Database');
});

describe('Server and Database Start Tests', function() {
  it('should check if the server is started and message is logged', function() {
    assert(app, 'Server is not started');
    sinon.assert.calledWith(consoleLogStub, 'Server is listening on port 3000');
  });

  it('should check if the database is connected and message is logged', function() {
    const isConnected = mongoose.connection.readyState === 1;
    assert(isConnected, 'Database is not connected');
    sinon.assert.calledWith(consoleLogStub, 'Connected to Database');
  });
});


describe('Connectors CRUD Operating Routes and funtions Tests', () => {
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
    consoleLogStub.restore();
    expect(getAllResponse.body).to.be.an('array').that.is.not.empty;
  });

  it('should get a connector by ID', async () => {
    const getByIdResponse = await request(app)
        .get(`/api/connectors/${objectId}`)
        .expect(200);
    expect(getByIdResponse.body._id).to.equal(objectId);
  });
  it('should get connectors by location', async () => {
    const latitude =23; // Example latitude
    const longitude = 22; // Example longitude
    const maxDistance = 100; // Example max distance in meters

    const getByLocationResponse = await request(app)
        .get(`/api/connectors/location/${latitude}/${longitude}/${maxDistance}`)
        .expect(200);
    expect(getByLocationResponse.body).to.be.an('array');
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
      connectorId: '133',
      type: 'Type B',
      status: 'Active',
      chargePointId: 'CS4CP002',
      chargeStationName: 'Station 4',
      location: {coordinates: [22, 23]},
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
