import { NextFunction, Request, Response } from "express";
import { CloudinaryStorage } from "../common/services/CloudinaryStorage";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { Book } from "../entity/Book";
import { BookCreateRequest, DeleteBookRequest } from "../types";
import { User } from "../entity/User";

import { unlink } from "fs/promises";
import path from "path";
import { CloudinaryOptions } from "../types/storage";

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
    const info = {
      currentPage: 1,
      recordsOnPage: 1,
      totalPage: 1,
      totalRecords: 1,
    };
    if (!isNaN(Number(page)) && !isNaN(Number(perPage))) {
      skip = (Number(page) - 1) * Number(perPage);
      take = Number(perPage);
      info.currentPage = Number(page);
    }
    const books = await this.bookRepository.find({
      select: ["id", "title", "coverImage", "file", "genre", "author"],
      skip,
      take,
    });
    const totalRecords = await this.bookRepository.count();
    info.recordsOnPage = books.length;
    info.totalRecords = totalRecords;
    info.totalPage = Math.ceil(info.totalRecords / take);
    res.status(200).json({ data: books, info });
  }
  async deleteById(req: DeleteBookRequest, res: Response, next: NextFunction) {
    const userId = req.auth.sub;
    const userInDb = await this.userRepository.findOneBy({
      id: Number(userId),
    });

    if (!userInDb) {
      next(
        createHttpError(404, "User associated with access token not found."),
      );
      return;
    }

    const { bookId } = req.params;
    if (isNaN(Number(bookId))) {
      next(createHttpError(400, "Incorrect Id format"));
      return;
    }
    const bookInDb = await this.bookRepository.findOne({
      where: {
        id: Number(bookId),
      },
      relations: {
        createdBy: true,
      },
    });
    if (!bookInDb) {
      next(createHttpError(404, "Book not found."));
      return;
    }

    if (bookInDb.createdBy.id !== Number(userId)) {
      next(
        createHttpError(401, "You are not authorized to delete this resource."),
      );
      return;
    }

    const bookFileUrl = bookInDb.file;
    if (bookFileUrl) {
      const bookFileUrlPartsArr = bookFileUrl.split("/");
      if (
        bookFileUrlPartsArr !== undefined &&
        bookFileUrlPartsArr.length >= 2
      ) {
        const bookFilePublicId =
          bookFileUrlPartsArr.at(-2)! + "/" + bookFileUrlPartsArr.at(-1);

        const bookFileOptions: CloudinaryOptions = {
          resource_type: "raw",
        };

        await this.storageService.delete(bookFilePublicId, bookFileOptions);
      }
    }

    const coverUrl = bookInDb.coverImage;
    if (coverUrl) {
      const coverUrlPartsArr = coverUrl.split("/");
      if (coverUrlPartsArr !== undefined && coverUrlPartsArr.length >= 2) {
        const coverPublicId =
          coverUrlPartsArr.at(-2)! +
          "/" +
          coverUrlPartsArr.at(-1)?.split(".")[0];
        await this.storageService.delete(coverPublicId, {});
      }
    }

    await this.bookRepository.delete({ id: bookInDb.id });

    return res.status(204).send();
  }
}
