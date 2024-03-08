
const {startServer} = require('./server');
const {connectToDatabase}=require('./db');

const PORT=3000;
const MONGO_URL='mongodb://127.0.0.1:27017/ChargeStationDB';

startServer(PORT);
connectToDatabase(MONGO_URL);
