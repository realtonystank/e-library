import logger from "../config/logger";
import connectDb from "./config/db";
import app from "./app";
import { Config } from "./config/config";

const startServer = async () => {
  const PORT = Config.PORT;
  try {
    await connectDb();
    logger.info("Database connected");
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

void startServer();
