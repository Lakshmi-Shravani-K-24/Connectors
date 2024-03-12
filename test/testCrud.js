/* eslint-disable max-len */
const request = require('supertest');
const nock = require('nock');
const {expect} = require('chai');
const assert = require('assert');
const sinon = require('sinon');
const mongoose = require('mongoose');
const {describe, it} = require('mocha');
const {startServer} = require('../server');


let objectId;
let sampleConnectorId;
const consoleLogStub = sinon.stub(console, 'log');

const PORT=3003;
const app=startServer(PORT);
require('../preparation.js');


describe('Server and Database Start Tests', function() {
  it('should check if the server is started and message is logged', function() {
    assert(app, 'Server is not started');
    sinon.assert.calledWith(consoleLogStub, 'Server is listening on port 3003');
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
    sampleConnectorId=createResponse.body.connectorId;
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
  it('should get a connector by connector ID', async () => {
    const getByIdResponse = await request(app)
        .get(`/api/connectors/connectorId/${sampleConnectorId}`)
        .expect(200);
    expect(getByIdResponse.body.connectorId).to.equal(sampleConnectorId);
  });
  it('should return connector details along with estimated charging time', async () => {
    const connectorId = '123';
    const connectorPowerInKiloWatt = 10;
    const batteryCapacityInKiloWattPerHour = 40;
    const socInPercentage = 50;
    const expectedTimeInMinutes = 120;

    // Define the response from Nock separately
    const nockResponse = {
      estimatedTimeInMinutes: expectedTimeInMinutes,
    };

    // Mocking the inner server query using Nock with the defined response
    nock('http://localhost:3001')
        .get('/connectors/estimatedChargingTime')
        .query(true)
        .reply(200, nockResponse);

    const response = await request(app)
        .get(`/api/connectors/chargingTime/123`)
        .query({
          connectorPowerInKiloWatt,
          batteryCapacityInKiloWattPerHour,
          socInPercentage,
          connectorId,
        });

    // Assertions
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.estimatedChargingTimeInMinutes, expectedTimeInMinutes);
  });

  it('should return error if there is an error fetching connector details', async () => {
    nock('http://localhost:3001')
        .get('/connectors/estimatedChargingTime')
        .query(true)
        .reply(400);
    const errorResponse = await request(app)
        .get(`/api/connectors/chargingTime/1234`)
        .query({
          connectorPowerInKiloWatt: 100,
          batteryCapacityInKiloWattPerHour: 200,
          socInPercentage: 50,
          connectorId: '1234',
        })
        .expect(400);
    assert.ok(errorResponse.body.error);
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
      connectorId: '139',
      type: 'Type B',
      status: 'Active',
      chargePointId: 'CS4CP002',
      chargeStationName: 'Station 4',
      location: {coordinates: [22, 23]},
    };

    const createresponse= await request(app)
        .post('/api/connectors')
        .send(connectorDataWithInvalidId)
        .expect(201);
    const createdConnectorId=createresponse._body._id;
    await request(app)
        .post('/api/connectors')
        .send(connectorDataWithInvalidId)
        .expect(400);
    await request(app)
        .delete(`/api/connectors/${createdConnectorId}`)
        .expect(200);
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
  it('should return  error if connector with given connectorID is not found', async () => {
    await request(app)
        .get(`/api/connectors/connectorId/cp001`)
        .expect(404);
  });
});
