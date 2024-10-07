import express, { NextFunction, Request, Response } from "express";
import userValidator from "./user-validator";
import UserController from "./userController";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post(
  "/register",
  userValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res, next),
);

export default userRouter;
