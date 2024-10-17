export interface FileData {
  files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}
export interface UploadSuccess {
  coverImageUrl: string;
  bookFileUrl: string;
}

export interface CloudinaryOptions {
  resource_type?: string;
  filename_override?: string;
  folder?: string;
  format?: string;
}

export interface FileStorage {
  upload(fileData: FileData): Promise<UploadSuccess>;
  delete(publicId: string, options: CloudinaryOptions): Promise<void>;
}
