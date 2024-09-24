import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: {
    serviceName: "<service-name>",
  },
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      silent: false,
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
      silent: false,
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "debug.log",
      level: "debug",
      silent: false,
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  ],
});
export default logger;
