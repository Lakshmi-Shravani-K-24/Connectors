/* eslint-disable max-len */
const request = require('supertest');
const nock = require('nock');
const {expect} = require('chai');
const assert = require('assert');
const sinon = require('sinon');
const {describe, before, it} = require('mocha');
const {MongoMemoryServer} = require('mongodb-memory-server');


let objectId;
let sampleConnectorId;
let mongoServer;
let mongoMemoryServerUrl;
let app;
let consoleLogStub;
let dbConnection;

describe('Testing the CRUD  operations of Connectors', () => {
  before(async ()=>{
    consoleLogStub = sinon.stub(console, 'log');
    mongoServer = await MongoMemoryServer.create();
    mongoMemoryServerUrl = mongoServer.getUri();
    const {startServer, connectToDatabase}=require('../serverAndDbStart');
    dbConnection=await connectToDatabase(mongoMemoryServerUrl);
    const PORT=3003;
    app=startServer(PORT);
  });
  after(async () => {
    const {stopServer, dropDatabase, closeDatabaseConnection}=require('../serverAndDbClose');
    stopServer(app);
    await dropDatabase();
    await closeDatabaseConnection();
    consoleLogStub.restore();
    sinon.assert.calledWith(consoleLogStub, 'Server stopped');
    sinon.assert.calledWith(consoleLogStub, 'Database dropped successfully');
    sinon.assert.calledWith(consoleLogStub, 'Disconnected from Database');
  });


  describe('Server and Database Start Tests', function() {
    it('should check if the server is started and message is logged', function() {
      assert(app, 'Server is not started');
      sinon.assert.calledWith(consoleLogStub, 'Server is listening on port 3003');
    });
    it('should check if the database is connected and message is logged', function() {
      const readyState = dbConnection.readyState;
      assert.strictEqual(readyState, 1, 'Database connection is not ready');
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
    it('should get connectors by location', async () => {
      const latitude =23;
      const longitude = 22;
      const maxDistance = 100;

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

    describe('Testing of estimation server', () => {
      const commonParams = {
        batteryCapacityInKiloWattPerHour: 40,
        socInPercentage: 50,
        connectorId: '123',
      };

      afterEach(() => {
        nock.cleanAll();
      });

      it('should return connector details along with estimated charging time', async () => {
        const expectedTimeInMinutes = 120;
        const nockResponse = {
          estimatedTimeInMinutes: expectedTimeInMinutes,
        };

        nock('http://estimate:3001')
            .get('/connectors/estimatedChargingTime')
            .query(true)
            .reply(200, nockResponse);

        const response = await request(app)
            .get(`/api/connectors/chargingTime/${commonParams.connectorId}`)
            .query(commonParams);
        console.log(response.body);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.estimatedChargingTimeInMinutes, expectedTimeInMinutes);
      });

      it('should return error with 404 if the connector with given connectorId is not found', async () => {
        nock('http://estimate:3001')
            .get('/connectors/estimatedChargingTime')
            .query(true)
            .replyWithError(404, 'connector not found');
        const notFoundResponse=await request(app)
            .get(`/api/connectors/chargingTime/12345`)
            .query({
              batteryCapacityInKiloWattPerHour: commonParams.batteryCapacityInKiloWattPerHour,
              socInPercentage: commonParams.socInPercentage,
              connectorId: '12345',
            });

        expect(notFoundResponse.status).to.equal(404);
        expect(notFoundResponse.body).to.have.property('error');
      });

      it('should respond with 400 if one or more required parameters are missing', async () => {
        const missingParameterResponse = await request(app)
            .get(`/api/connectors/chargingTime/${commonParams.connectorId}`);

        expect(missingParameterResponse.status).to.equal(400);
        expect(missingParameterResponse.body).to.have.property('error');
      });

      it('should respond with 500 if estimation server is not responding', async () => {
        nock('http://estimate:3001')
            .get('/connectors/estimatedChargingTime')
            .query(true)
            .replyWithError(500, 'Estimation server is not responding');
        const serverOffResponse=await request(app)
            .get(`/api/connectors/chargingTime/${commonParams.connectorId}`)
            .query(commonParams);
        expect(serverOffResponse.status).to.equal(500);
        expect(serverOffResponse.body).to.have.property('error');
      });
    });

    describe('Deleting a connector by ID', () => {
      it('should delete a connector by ID', async () => {
        const deleteResponse = await request(app)
            .delete(`/api/connectors/${objectId}`)
            .expect(200);
        assert(deleteResponse, 'Database is not connected');
        expect(deleteResponse.body._id).to.equal(objectId);
      });
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
      const nonExistentId='00f0f000fff0f000f000fff0';
      await request(app)
          .get(`/api/connectors/${nonExistentId}`)
          .expect(404);
    });
    it('should return  error if connector with given connectorID is not found', async () => {
      await request(app)
          .get(`/api/connectors/connectorId/cp001`)
          .expect(404);
    });
  });
});
