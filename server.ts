import logger from "./config/logger";
function login(username: string): boolean {
  console.log(username);
  logger.debug("Hello world!");
  return true;
}

login("codersgyan");
