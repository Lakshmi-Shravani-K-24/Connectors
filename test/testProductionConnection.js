const assert = require('assert');
const sinon = require('sinon');
const {describe, it, before, after} = require('mocha');

let consoleLogStub;
let server;

describe('Testing Production server', () => {
  before(async ()=>{
    consoleLogStub = sinon.stub(console, 'log');
    ({server} = require('../index.js'));
  });
  describe('Production Server Start', function() {
    it('should check if the production server is started and message is logged', function() {
      assert(server, 'Production Server is not started');
      sinon.assert.calledWith(consoleLogStub, 'Server is listening on port 3000');
    });
  });
  describe('Index.js Module Exports', function() {
    it('should throw an error if module.exports is empty or not assigned properly', function() {
      const exportedModule = require('../index.js');
      assert(Object.keys(exportedModule).length > 0, 'Expected module.exports to be non-empty');
    });
  });

  after(async ()=>{
    const {stopServer} = require('../serverAndDbClose');
    stopServer(server);
    consoleLogStub.restore();
  });
});
