import { AppDataSource } from "./data-source";

const connectDb = async () => {
  return await AppDataSource.initialize();
};
export default connectDb;
