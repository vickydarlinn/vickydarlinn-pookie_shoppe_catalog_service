import { connect } from "mongoose";
import { Config } from ".";
import createHttpError from "http-errors";
import logger from "./logger";

export const connectDB = async () => {
  if (Config.DB_URL) {
    try {
      await connect(Config.DB_URL);
      logger.info("Connected to db successfully");
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, error.message);
      }
    }
  }
};
