const mongoose = require('mongoose');
const sinon = require('sinon');
const assert = require('assert');
const {consoleLogStub}=require('./testCrud');
const {describe, it} = require('mocha');


const {app}=require('../index');


describe('Production Server and Database Start Tests', function() {
  it('should check if the production server is started and message is logged', function() {
    assert(app, 'Production Server is not started');
    sinon.assert.calledWith(consoleLogStub, 'Server is listening on port 3000');
  });
  it('should check if the database is connected and message is logged', function() {
    const isProductionDatabaseConnected = mongoose.connection.readyState === 1;
    assert(isProductionDatabaseConnected, 'Production Database is not connected');
    sinon.assert.calledWith(consoleLogStub, 'Connected to Database');
    consoleLogStub.restore();
  });
});


