import mongoose from 'mongoose';
import app from './app.js';
import 'dotenv/config';

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Successfully connected to Database');
  app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
  });
});
