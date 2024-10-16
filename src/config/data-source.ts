import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Refresh_Tokens } from "../entity/Refresh_Tokens";
import { Book } from "../entity/Book";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.NODE_ENV === "testing" ? ":memory:" : "database.sqlite",
  synchronize: process.env.NODE_ENV === "testing" ? true : false,
  logging: false,
  entities: [User, Refresh_Tokens, Book],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
