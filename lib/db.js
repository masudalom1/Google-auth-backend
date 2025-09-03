import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Database connected.");
  } catch (error) {
    throw error;
    console.log("Error to connect database");
  }
};
