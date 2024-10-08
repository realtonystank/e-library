import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import userRegisterValidator from "./user-register-validator";
import userLoginValidator from "./user-login-validator";
import UserController from "./UserController";
import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";
import { AuthRequest } from "../types";
import validateRefreshToken from "../common/middlewares/validateRefreshToken";

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

userRouter.post(
  "/self",
  authenticate as RequestHandler,
  asyncWrapper((req: Request, res: Response) =>
    userController.self(req as AuthRequest, res),
  ),
);

userRouter.post(
  "/refresh",
  validateRefreshToken as RequestHandler,
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    userController.refresh(req as AuthRequest, res, next),
  ),
);

userRouter.post(
  "/logout",
  authenticate as RequestHandler,
  asyncWrapper((req: Request, res: Response) =>
    userController.logout(req as AuthRequest, res),
  ),
);

export default userRouter;
