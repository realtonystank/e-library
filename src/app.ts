import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import cookieParser from "cookie-parser";
import bookRouter from "./book/bookRouter";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.use(globalErrorHandler);

export default app;
