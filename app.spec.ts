import request from "supertest";
import server from "./src/server";

describe("App", () => {
  it("should work", () => {
    const result = 100;
    expect(result).toBe(100);
  });
  it("should return 200 status", async () => {
    const response = await request(() => server)
      .get("/")
      .send();

    expect(response.statusCode).toBe(200);
  });
});
