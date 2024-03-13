const mongoose = require('mongoose');
const sinon = require('sinon');
const assert = require('assert');
const {consoleLogStub}=require('./testCrud');
const {describe, it} = require('mocha');

let server;

describe('Testing Production server and Database', ()=>{
  before(async ()=>{
    server=require('../index');
  });
  after(async () => {
    const {closeDatabaseConnection}=require('../serverAndDbClose');
    await closeDatabaseConnection();
  });
  describe('Production Server and Database Start Tests', function() {
    it('should check if the production server is started and message is logged', function() {
      assert(server, 'Production Server is not started');
      sinon.assert.calledWith(consoleLogStub, 'Server is listening on port 3000');
    });
    it('should check if production database is connected and message is logged', async function() {
      const isProductionDatabaseConnected = mongoose.connection.readyState === 1;
      assert(isProductionDatabaseConnected, 'Production Database is not connected');
      sinon.assert.calledWith(consoleLogStub, 'Connected to Database');
      consoleLogStub.restore();
    });
  });
});
