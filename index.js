
const PORT=3000;
process.env.MONGO_URL='mongodb://127.0.0.1:27017/ChargeStationDB';
const {connectToDatabase, startServer}=require('./serverAndDbStart');
async function establishDatabaseConnection() {
  await connectToDatabase(process.env.MONGO_URL);
}


const app=startServer(PORT);

establishDatabaseConnection();
module.exports={app};
