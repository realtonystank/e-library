import { NextFunction, Request, Response } from "express";
import { CloudinaryStorage } from "../common/services/CloudinaryStorage";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export default class BookController {
  constructor(private storageService: CloudinaryStorage) {}
  create(req: Request, res: Response, next: NextFunction) {
    const createBookValidation = validationResult(req);
    if (!createBookValidation.isEmpty()) {
      next(createHttpError(400, createBookValidation.array()[0]));
      return;
    }

    console.log(req.body);
    console.log(req.files);
    console.log(JSON.stringify(req.body));
    this.storageService.upload({ files: req.files! });
    res.status(201).json({ message: "success" });
  }
}
