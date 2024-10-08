import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
const app = express();

app.use(express.json());

app.use("/api/users", userRouter);

app.use(globalErrorHandler);

export default app;
