import { FileData, FileStorage } from "../../types/storage";
import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import { Config } from "../../config/config";

export class CloudinaryStorage implements FileStorage {
  private client: ConfigOptions;
  constructor() {
    this.client = cloudinary.config({
      cloud_name: Config.CLOUDINARY_CLOUD,
      api_key: Config.CLOUDINARY_API_KEY,
      api_secret: Config.CLOUDINARY_API_SECRET,
    });
  }

  upload(fileData: FileData): void {
    console.log(fileData);
  }
  delete(fileName: string): void {
    console.log(fileName);
    throw new Error("Method not implemented.");
  }
  getObjectUri(fileName: string): void {
    console.log(fileName);
    throw new Error("Method not implemented.");
  }
}
