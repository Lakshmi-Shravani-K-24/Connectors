const request = require('supertest');
const {server} = require('../index');
const {expect} = require('chai');
const {closeDatabaseConnection} = require('../db');
const {stopServer} = require('../server');

describe('Test / endpoint', async () => {
  // Test the GET / endpoint
  it('should return JSON message "Welcome to the home route!"', async () => {
    const response = await request(server).get('/');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({message: 'Welcome to the Connectors route!'});
  });
  await closeDatabaseConnection();
  stopServer();
});
