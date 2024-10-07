import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from "./config";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: Config.NODE_ENV !== "production",
  logging: false,
  entities: [User],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
