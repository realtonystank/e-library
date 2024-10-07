import request from "supertest";
import app from "./src/app";
import { App } from "supertest/types";
import { DataSource } from "typeorm";
import { AppDataSource } from "./src/config/data-source";
import { truncateTables } from "./src/tests/utils";
import { User } from "./src/entity/User";

describe("App", () => {
  let connection: DataSource;
  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });
  beforeEach(async () => {
    await truncateTables(connection);
  });
  afterAll(async () => {
    if (connection) await connection.destroy();
  });

  it("should work", () => {
    const result = 100;
    expect(result).toBe(100);
  });
  it("should return 200 status", async () => {
    const response = await request(app as unknown as App)
      .get("/")
      .send();

    expect(response.statusCode).toBe(200);
    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();
    expect(users.length).toBe(1);
    expect(users[0].name).toBe("Priyansh");
  });
  it("should return 201 status", async () => {
    const response = await request(app as unknown as App)
      .post("/api/users/register")
      .send();

    console.log("response is - ", response.body);

    expect(response.statusCode).toBe(201);
  });
});
