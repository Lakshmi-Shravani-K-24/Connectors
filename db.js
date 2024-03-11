const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL;

const connectToDatabase = () => {
  mongoose.connect(mongoURL)
      .then(() => {
        console.log(mongoURL);
        console.log('Connected to Database');
      }).catch((error) => {
        console.error('Error connecting to database:', error);
      });
};


connectToDatabase();
