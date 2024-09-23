import { Config } from "./config";
import logger from "./config/logger";
import app from "./app";
import { connectDB } from "./config/connectDB";

connectDB();
app.listen(Config.PORT, () => {
  logger.info(`Server is running at ${Config.PORT} in ${Config.NODE_ENV} mode`);
});
