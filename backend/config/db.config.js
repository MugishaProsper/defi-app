import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

export const connectToDatabase = async () => {
  try {
    mongoose.connect(process.env.mongo_url).catch((err) => {
      console.error(err.message);
    }).then(() => {
      console.log('Connected to MongoDB');
    }).catch((err) => {
      console.log(err)
    })
  } catch (error) {
    console.error(error.message);
  }
}