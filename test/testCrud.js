const request = require('supertest');
// const mongoose = require('mongoose');
const {expect} = require('chai');
// const {MongoMemoryServer} = require('mongodb-memory-server');
const {before, describe, it} = require('mocha');

const startServer = require('../index'); // Import the startServer function

let objectId;
let app;

before(async () => {
  app = await startServer();
});

describe('CRUD Operations', () => {
  const newConnectorData = {
    connectorId: '123',
    type: 'Type A',
    status: 'Active',
    chargePointId: 'CP001',
    chargeStationName: 'Station 1',
    location: {type: 'Point', coordinates: [0, 0]},
  };

  it('should create a new connector', async () => {
    const response = await request(app)
        .post('/api/connectors')
        .send(newConnectorData)
        .expect(201);
    objectId=response.body._id;
    console.log(objectId);
    expect(response.body.connectorId).equal(newConnectorData.connectorId);
  });

  it('should get all connectors', async () => {
    const response = await request(app)
        .get('/api/connectors')
        .expect(200);

    expect(response.body).to.be.an('array').that.is.not.empty;
  });

  it('should get a connector by ID', async () => {
    const response = await request(app)
        .get(`/api/connectors/${objectId}`)
        .expect(200);

    expect(response.body._id).to.equal(objectId);
  });

  it('should update a connector by ID', async () => {
    const updatedConnectorData = {
      type: 'Type B',
      status: 'Inactive',
    };

    const response = await request(app)
        .put(`/api/connectors/${objectId}`)
        .send(updatedConnectorData)
        .expect(200);

    expect(response.body).to.deep.include(updatedConnectorData);
  });

  it('should delete a connector by ID', async () => {
    const response = await request(app)
        .delete(`/api/connectors/${objectId}`)
        .expect(200);

    expect(response.body._id).to.equal(objectId);
  });
});
