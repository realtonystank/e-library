import logger from "../config/logger";
import app from "./app";
import { Config } from "./config/config";
import { AppDataSource } from "./config/data-source";

const startServer = () => {
  const PORT: string = Config.PORT;
  try {
    AppDataSource.initialize()
      .then(() => {
        // here you can start to work with your database
        logger.info("Database connected");
        app.listen(PORT, () => logger.info(`Server running on PORT:${PORT}`));
      })
      .catch((error) => console.log(error));
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
