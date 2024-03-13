require('dotenv').config();
const {connectToDatabase, startServer} = require('./serverAndDbStart');

const port=3000;
const server = startServer(port);
connectToDatabase(process.env.MONGODB_URL);

module.exports = {server};
