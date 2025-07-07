import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

// MongoDB connection
const client = await mongoose.connect(process.env.MONGO_URI, {
  // Options can be added here if needed
});

export const db = client;