import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

export const connectToDatabase = () => {
  try {
    mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log('Connected to MongoDB');
    }).catch((err) => {
      console.log(err);
    })
  } catch (error) {
    console.error(error.message);
  }
}