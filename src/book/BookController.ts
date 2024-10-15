import { NextFunction, Response } from "express";
import { CloudinaryStorage } from "../common/services/CloudinaryStorage";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { In, Repository } from "typeorm";
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

    const { bookFileUrl, coverImageUrl } = await this.storageService.upload({
      files: req.files!,
    });

    const authorId = req.body.author.split(",").map((id) => Number(id));
    const author = await this.userRepository.find({
      where: {
        id: In(authorId),
      },
    });

    await this.bookRepository.save({
      coverImage: coverImageUrl,
      file: bookFileUrl,
      title: req.body.title,
      genre: req.body.genre,
      author: author,
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
}
