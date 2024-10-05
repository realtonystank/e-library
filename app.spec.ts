import request from "supertest";
import app from "./src/app";
import { App } from "supertest/types";

describe("App", () => {
  it("should work", () => {
    const result = 100;
    expect(result).toBe(100);
  });
  it("should return 200 status", async () => {
    const response = await request(app as unknown as App)
      .get("/")
      .send();

    expect(response.statusCode).toBe(200);
  });
});
