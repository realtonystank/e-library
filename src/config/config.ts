import config from "config";

type configuration = {
  port: string;
};

const _config: configuration = {
  port: config.get("server.port") || "3000",
};

export const Config = Object.freeze(_config);
