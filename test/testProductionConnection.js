const assert = require('assert');
const sinon = require('sinon');
const {describe, it, before, after} = require('mocha');

let consoleLogStub;
let server;
// let mongoDbConnection;


describe('Testing Production server and Database', () => {
  before(async ()=>{
    consoleLogStub = sinon.stub(console, 'log');
    ({server} = require('../index.js'));
  });
  // describe('Database Connection', function() {
  //   it('should ensure database connection is established', function() {
  //     assert(mongoDbConnection, 'Database connection is not established');
  //     const readyStateOfMongoDb= mongoDbConnection.readyState;
  //     assert.strictEqual(readyStateOfMongoDb, 1, 'Database connection is not ready');
  //   });
  // });

  describe('Production Server Start', function() {
    it('should check if the production server is started and message is logged', function() {
      assert(server, 'Production Server is not started');
      sinon.assert.calledWith(consoleLogStub, 'Server is listening on port 3000');
    });
  });
  after(async ()=>{
    const {stopServer} = require('../serverAndDbClose');
    stopServer(server);
    consoleLogStub.restore();
  });
});
