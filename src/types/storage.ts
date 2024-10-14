export interface FileData {
  files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

export interface FileStorage {
  upload(fileData: FileData): void;
  delete(fileName: string): void;
  getObjectUri(fileName: string): void;
}
