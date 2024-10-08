import config from "config";

type configuration = {
  PORT: string;
  NODE_ENV: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
};

const _config: configuration = {
  PORT: config.get("server.port") || "3000",
  NODE_ENV: process.env.NODE_ENV as string,
  ACCESS_TOKEN_SECRET: config.get("server.accesstokensecret"),
  REFRESH_TOKEN_SECRET: config.get("server.refreshtokensecret"),
};

export const Config = Object.freeze(_config);
