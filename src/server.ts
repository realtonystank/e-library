import logger from "../config/logger";
import app from "./app";
import { Config } from "./config/config";

const startServer = () => {
  const PORT: string = Config.PORT;
  try {
    app.listen(PORT, () => logger.info(`Server running on PORT:${PORT}`));
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`Something went wrong - ${err}`);
    } else {
      logger.error("An unknown error");
    }
    process.exit(1);
  }
};

startServer();
