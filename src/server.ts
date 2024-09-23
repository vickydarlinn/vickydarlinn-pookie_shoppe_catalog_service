import { Config } from "./config";
import logger from "./config/logger";
import app from "./app";

app.listen(Config.PORT, () => {
  logger.info(`Server is running at http://localhost:${Config.PORT}`);
});
