import { checkSchema } from "express-validator";

type CreateBookRequest = {
  files: {
    coverImage: Express.Multer.File[];
    file: Express.Multer.File[];
  };
};

export default checkSchema({
  title: {
    exists: {
      errorMessage: "Title is required",
    },
  },
  genre: {
    exists: {
      errorMessage: "Genre is required",
    },
  },
  author: {
    exists: {
      errorMessage: "Author is required",
    },
    custom: {
      options: (value: string) => {
        const valueArr = value.split(",");
        return valueArr.every((userId) => !isNaN(Number(userId)));
      },
      errorMessage:
        "Author array must contain string to number convertible author id",
    },
  },
  coverImage: {
    custom: {
      options: (value, { req }) => {
        const _req = req as CreateBookRequest;
        if (!_req.files || !_req.files.coverImage) {
          throw new Error("Cover image is required");
        }
        return true;
      },
    },
  },
  file: {
    custom: {
      options: (value, { req }) => {
        const _req = req as CreateBookRequest;
        if (!_req.files || !_req.files.file) {
          throw new Error("file is required");
        }

        return true;
      },
    },
  },
});
