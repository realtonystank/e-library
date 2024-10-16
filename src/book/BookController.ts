import { NextFunction, Request, Response } from "express";
import { CloudinaryStorage } from "../common/services/CloudinaryStorage";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { Book } from "../entity/Book";
import { BookCreateRequest } from "../types";
import { User } from "../entity/User";

import { unlink } from "fs/promises";
import path from "path";

export default class BookController {
  constructor(
    private storageService: CloudinaryStorage,
    private bookRepository: Repository<Book>,
    private userRepository: Repository<User>,
  ) {}
  async create(req: BookCreateRequest, res: Response, next: NextFunction) {
    const createBookValidation = validationResult(req);
    if (!createBookValidation.isEmpty()) {
      next(createHttpError(400, createBookValidation.array()[0]));
      return;
    }

    const userId = req.auth.sub;
    const createdBy = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!createdBy) {
      next(createHttpError(404, "User associated with access token not found"));
      return;
    }

    const { bookFileUrl, coverImageUrl } = await this.storageService.upload({
      files: req.files!,
    });

    await this.bookRepository.save({
      coverImage: coverImageUrl,
      file: bookFileUrl,
      title: req.body.title,
      genre: req.body.genre,
      author: req.body.author,
      createdBy,
    });

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    await unlink(
      path.resolve(
        __dirname,
        "../../public/data/uploads",
        files.coverImage[0].filename,
      ),
    );
    await unlink(
      path.resolve(
        __dirname,
        "../../public/data/uploads",
        files.file[0].filename,
      ),
    );

    res.status(201).json({ message: "success" });
  }
  async getAll(req: Request, res: Response) {
    const { page, perPage } = req.query;
    let skip = 0;
    let take = 10;
    if (!isNaN(Number(page)) && !isNaN(Number(perPage))) {
      skip = (Number(page) - 1) * Number(perPage);
      take = Number(perPage);
    }
    const allBooks = await this.bookRepository.find({
      select: ["id", "title", "coverImage", "file", "genre", "author"],
      skip,
      take,
    });

    res.status(200).json({ data: allBooks });
  }
}
