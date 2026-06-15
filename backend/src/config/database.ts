import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../config/logger.js";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI!);
    logger.info("MongoDB connected successfully!");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
