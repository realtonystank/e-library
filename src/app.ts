import express from "express";
import createHttpError from "http-errors";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
const app = express();

app.get("/", (req, res, next) => {
  const err = createHttpError(401, "You are not allowed to access this page");
  return next(err);
  res.send("Welcome to auth service");
});

app.use(globalErrorHandler);

export default app;
