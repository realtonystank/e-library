import config from "config";

type configuration = {
  PORT: string;
  NODE_ENV: string;
};

const _config: configuration = {
  PORT: config.get("server.port") || "3000",
  NODE_ENV: process.env.NODE_ENV as string,
};

export const Config = Object.freeze(_config);
