import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import logger from "../../config/logger";
import { sign } from "jsonwebtoken";
import { Config } from "../config/config";

interface createUser {
  name: string;
  email: string;
  password: string;
}

interface createUserRequest extends Request {
  body: createUser;
}

interface loginUserRequest extends Request {
  body: Omit<createUser, "name">;
}

export default class UserController {
  async create(req: createUserRequest, res: Response, next: NextFunction) {
    const userValidation = validationResult(req);
    if (!userValidation.isEmpty()) {
      console.log(userValidation.array());
      next(createHttpError(400, userValidation.array()[0].msg as string));
      return;
    }

    const { name, email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const userInDb = await userRepository.findOneBy({ email: email });

    if (userInDb) {
      next(createHttpError(400, "Duplicate email"));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.password = hashedPassword;
    const savedUser = await userRepository.save(newUser);

    logger.info(`Created new user with id:${savedUser.id}`);

    res
      .status(201)
      .json({ message: `User registered, with id:${savedUser.id}` });
  }
  async login(req: loginUserRequest, res: Response, next: NextFunction) {
    const loginValidationResult = validationResult(req);
    if (!loginValidationResult.isEmpty()) {
      next(
        createHttpError(400, loginValidationResult.array()[0].msg as string),
      );
      return;
    }

    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const userInDb = await userRepository.findOneBy({ email: email });

    if (!userInDb) {
      next(createHttpError(401, "Invalid email or password"));
      return;
    }

    const isMatch = await bcrypt.compare(password, userInDb.password);

    if (!isMatch) {
      next(createHttpError(401, "Invalid email or password"));
      return;
    }

    const accessToken = sign({ sub: userInDb.id }, Config.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = sign(
      { sub: userInDb.id },
      Config.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("AccessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });
    res.cookie("RefreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({ id: userInDb.id });
  }
}
