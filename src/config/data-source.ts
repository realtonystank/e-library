import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
