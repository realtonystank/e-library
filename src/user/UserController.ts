import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

interface createUser {
  name: string;
  email: string;
  password: string;
}

interface createUserRequest extends Request {
  body: createUser;
}

export default class UserController {
  create(req: createUserRequest, res: Response, next: NextFunction) {
    const userValidation = validationResult(req);
    if (!userValidation.isEmpty()) {
      console.log(userValidation.array());
      next(createHttpError(400, userValidation.array()[0].msg as string));
      return;
    }

    res.status(201).json({ message: "User registered" });
  }
}
