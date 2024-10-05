import logger from "../config/logger";
import app from "./app";
import { Config } from "./config/config";

const startServer = () => {
  const PORT: string = Config.PORT;
  try {
    app.listen(PORT, () => logger.info(`Server running on PORT:${PORT}`));
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Something went wrong - ${err}`);
    }

    process.exit(1);
  }
};

const server = startServer();
export default server;
