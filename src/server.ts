import { Config } from "./config";
import logger from "./config/logger";
import app from "./app";
import { connectDB } from "./config/connectDB";

const startServer = async () => {
  const PORT = Config.PORT;
  try {
    await connectDB();
    logger.info("Database connected successfully");
    app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(err.message);
      logger.on("finish", () => {
        process.exit(1);
      });
    }
  }
};

void startServer();
