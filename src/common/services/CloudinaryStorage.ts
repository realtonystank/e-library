import {
  CloudinaryOptions,
  FileData,
  FileStorage,
  UploadSuccess,
} from "../../types/storage";
import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import { Config } from "../../config/config";
import path from "node:path";

export class CloudinaryStorage implements FileStorage {
  private client: ConfigOptions;
  constructor() {
    this.client = cloudinary.config({
      cloud_name: Config.CLOUDINARY_CLOUD,
      api_key: Config.CLOUDINARY_API_KEY,
      api_secret: Config.CLOUDINARY_API_SECRET,
    });
  }

  async upload(fileData: FileData): Promise<UploadSuccess> {
    const files = fileData.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../../public/data/uploads",
      fileName,
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../../public/data/uploads",
      bookFileName,
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-file",
        format: "pdf",
      },
    );

    return {
      coverImageUrl: uploadResult.secure_url,
      bookFileUrl: bookFileUploadResult.secure_url,
    };
  }
  async delete(publicId: string, options: CloudinaryOptions): Promise<void> {
    console.log(publicId);
    await cloudinary.uploader.destroy(publicId, options);
  }
}
