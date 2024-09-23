import express from "express";
import { Config } from "./config";
import logger from "./config/logger";

const app = express();

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.listen(Config.PORT, () => {
  logger.info(`Server is running at http://localhost:${Config.PORT}`);
});
