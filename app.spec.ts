import request from "supertest";
import app from "./src/app";
import { App } from "supertest/types";
import { DataSource } from "typeorm";
import { AppDataSource } from "./src/config/data-source";
import { truncateTables } from "./src/tests/utils";
import { User } from "./src/entity/User";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Config } from "./src/config/config";

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
  it("should return 201 status when user registers", async () => {
    const dummyUser = {
      name: "Test User",
      email: "testuser@gmail.com",
      password: "secret12345!",
    };
    const response = await request(app as unknown as App)
      .post("/api/users/register")
      .send(dummyUser);

    expect(response.statusCode).toBe(201);

    const userRepository = connection.getRepository(User);

    const userInDb = await userRepository.find();
    expect(userInDb).not.toBeNull();
    expect(userInDb).toHaveLength(1);
    expect(userInDb[0].name).toBe("Test User");
  });
  it("should return 200 status when user logins", async () => {
    const userRepository = connection.getRepository(User);

    const dummyUser = {
      name: "Test User",
      email: "testuser@gmail.com",
      password: "secret12345!",
    };

    const hashedPassword = await hash(dummyUser.password, 10);
    dummyUser.password = hashedPassword;

    await userRepository.save(dummyUser);

    const payload = {
      email: "testuser@gmail.com",
      password: "secret12345!",
    };

    const response = await request(app as unknown as App)
      .post("/api/users/login")
      .send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();

    // Extract cookies from the response
    const cookies = response.headers["set-cookie"];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

    // Check if the specific cookie key exists
    const hasAccessTokenCookie = cookieArray.some((cookie: string) =>
      cookie.startsWith("AccessToken="),
    );

    // Assert that the cookie is present
    expect(hasAccessTokenCookie).toBe(true);
  });
  it("should return 200 status when user hits self route", async () => {
    const dummyUser = {
      name: "Test User",
      email: "testuser@gmail.com",
      password: "secret123!",
    };

    const userRepository = connection.getRepository(User);
    const userInDb = await userRepository.save(dummyUser);

    const accessToken = sign({ sub: userInDb.id }, Config.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const response = await request(app as unknown as App)
      .post("/api/users/self")
      .set("Cookie", [`AccessToken=${accessToken}`])
      .send();

    expect(response.statusCode).toBe(200);
  });
});
