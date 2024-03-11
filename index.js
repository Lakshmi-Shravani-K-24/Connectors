
const {startServer} = require('./server');

const PORT=3000;
process.env.MONGO_URL='mongodb://127.0.0.1:27017/ChargeStationDB';

startServer(PORT);
require('./db');
