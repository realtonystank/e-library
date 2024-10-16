import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import multer from "multer";
import path from "path";
import { asyncWrapper } from "../common/utils/wrapper";
import BookController from "./BookController";
import { CloudinaryStorage } from "../common/services/CloudinaryStorage";
import createValidator from "./createValidator";
import { AppDataSource } from "../config/data-source";
import { Book } from "../entity/Book";
import { User } from "../entity/User";
import authenticate from "../common/middlewares/authenticate";
import { BookCreateRequest } from "../types";
const bookRouter = express.Router();
const cloudinaryStorage = new CloudinaryStorage();
const bookRepository = AppDataSource.getRepository(Book);
const userRepository = AppDataSource.getRepository(User);
const bookController = new BookController(
  cloudinaryStorage,
  bookRepository,
  userRepository,
);

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 1024 * 1024 * 10 },
});

bookRouter.post(
  "/create",
  authenticate as RequestHandler,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  createValidator,
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    bookController.create(req as BookCreateRequest, res, next),
  ),
);
bookRouter.get(
  "/",
  asyncWrapper((req: Request, res: Response) =>
    bookController.getAll(req, res),
  ),
);

export default bookRouter;
