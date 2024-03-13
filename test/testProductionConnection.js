const sinon = require('sinon');
const assert = require('assert');
const {describe, it, before, after} = require('mocha');
const {stopServer, closeDatabaseConnection} = require('../serverAndDbClose');

let server;
let mongoDbConnection;
let consoleLogStub;

describe('Testing Production server and Database', () => {
  before(async function() {
    consoleLogStub = sinon.stub(console, 'log');
    const {server: serverInstance, dbConnection: dbConn} = await require('../index');
    server = serverInstance;
    mongoDbConnection = dbConn;
  });
  after(async function() {
    stopServer(server);
    await closeDatabaseConnection();
    sinon.assert.calledWith(consoleLogStub, 'Server stopped');
    sinon.assert.calledWith(consoleLogStub, 'Disconnected from Database');
    consoleLogStub.restore();
  });

  describe('Database Connection', function() {
    it('should ensure database connection is established', function() {
      assert(mongoDbConnection, 'Database connection is not established');
      const readyStateOfMongoDb= mongoDbConnection.readyState;
      sinon.assert.calledWith(consoleLogStub, 'Connected to Database');
      assert.strictEqual(readyStateOfMongoDb, 1, 'Database connection is not ready');
    });
  });

  describe('Production Server Start', function() {
    it('should check if the production server is started and message is logged', function() {
      assert(server, 'Production Server is not started');
      sinon.assert.calledWith(consoleLogStub, 'Server is listening on port 3000');
    });
  });
});
