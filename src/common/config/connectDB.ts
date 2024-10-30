import { connect } from "mongoose";
import { Config } from ".";

export const connectDB = async () => {
  await connect(Config.DB_URL!);
};
