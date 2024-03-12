
const {MongoMemoryServer} = require('mongodb-memory-server');
const {before, after} = require('mocha');
const nock = require('nock');
const {stopServer} = require('./server');
const {dropDatabase, closeDatabaseConnection}=require('./closedb');
// const sinon = require('sinon');
// const {consoleLogStub}=require('./test/testCrud');

let mongoServer;
let mongoMemoryServerUrl;

async function getMongoMemoryServerUrl() {
  mongoServer = await MongoMemoryServer.create();
  mongoMemoryServerUrl = mongoServer.getUri();
  process.env.MONGO_URL=mongoMemoryServerUrl;
  require('./db');
}

before(async ()=>{
  await getMongoMemoryServerUrl();
});
after(async () => {
  stopServer();
  await dropDatabase();
  await closeDatabaseConnection();
  // sinon.assert.calledWith(consoleLogStub, 'Server stopped');
  // // sinon.assert.calledWith(consoleLogStub, 'Database dropped successfully');
  // // sinon.assert.calledWith(consoleLogStub, 'Disconnected from Database');
  nock.cleanAll();
});
module.exports={getMongoMemoryServerUrl};
