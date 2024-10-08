import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Refresh_Tokens } from "../entity/Refresh_Tokens";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: false,
  logging: false,
  entities: [User, Refresh_Tokens],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
