export interface FileData {
  files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}
export interface UploadSuccess {
  coverImageUrl: string;
  bookFileUrl: string;
}

export interface FileStorage {
  upload(fileData: FileData): Promise<UploadSuccess>;
  delete(fileName: string): void;
  getObjectUri(fileName: string): void;
}
