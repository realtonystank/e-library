import config from "config";

type configuration = {
  PORT: string;
  NODE_ENV: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  CLOUDINARY_CLOUD: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
};

const _config: configuration = {
  PORT: config.get("server.port") || "3000",
  NODE_ENV: process.env.NODE_ENV as string,
  ACCESS_TOKEN_SECRET: config.get("server.accesstokensecret"),
  REFRESH_TOKEN_SECRET: config.get("server.refreshtokensecret"),
  CLOUDINARY_CLOUD: config.get("cloud.cloudinary_cloud"),
  CLOUDINARY_API_KEY: config.get("cloud.cloudinary_api_key"),
  CLOUDINARY_API_SECRET: config.get("cloud.cloudinary_api_secret"),
};

export const Config = Object.freeze(_config);
