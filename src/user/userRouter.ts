import express, { NextFunction, Request, Response } from "express";
import userValidator from "./user-validator";
import UserController from "./UserController";
import { asyncWrapper } from "../common/utils/wrapper";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post(
  "/register",
  userValidator,
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res, next),
  ),
);

export default userRouter;
