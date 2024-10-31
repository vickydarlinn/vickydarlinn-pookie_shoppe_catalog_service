import express, { Request, Response } from "express";
import cors from "cors";

import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";
import cookieParser from "cookie-parser";
import { Config } from "./common/config";

const app = express();
const ALLOWED_DOMAINS = [
  Config.CLIENT_UI_DOMAIN,
  Config.ADMIN_UI_DOMAIN,
  "http://localhost:5174"
];
app.use(
  cors({
    origin: ALLOWED_DOMAINS as string[],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from catalog service!" });
});

app.use("/categories", categoryRouter);

app.use(globalErrorHandler);

export default app;
