import express, { NextFunction, Request, Response } from "express";
import userRegisterValidator from "./user-register-validator";
import userLoginValidator from "./user-login-validator";
import UserController from "./UserController";
import { asyncWrapper } from "../common/utils/wrapper";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post(
  "/register",
  userRegisterValidator,
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res, next),
  ),
);

userRouter.post(
  "/login",
  userLoginValidator,
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    userController.login(req, res, next),
  ),
);

export default userRouter;
