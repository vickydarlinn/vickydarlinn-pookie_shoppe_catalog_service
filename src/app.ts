import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";

import { HttpError } from "http-errors";

const app = express();

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  let message = "Internal server error";
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode === 400) {
    message = err.message;
  }
  logger.error(err.message);

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: message,
        path: req.path,
        method: req.method,
        location: "server"
      }
    ]
  });
});
export default app;
