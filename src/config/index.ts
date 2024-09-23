import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`)
});

const { PORT, LOG_LEVEL, NODE_ENV } = process.env;

export const Config = {
  PORT,
  LOG_LEVEL,
  NODE_ENV
};
