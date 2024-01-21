import { app, server } from "../src/index";
import request from "supertest";
//polly

describe("POST /translate", () => {
  afterAll(() => {
    server.close();
  });

  test("should respond with a 200 status code", async () => {
    const response = await request(app)
      .post("/translate")
      .send({ text: "dog", language: "pl" });
    expect(response.statusCode).toBe(200);
  });
  test("should specify JSON in the content type header", async () => {
    const response = await request(app)
      .post("/translate")
      .send({ text: "dog", language: "pl" });
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });
  test("should translate proper data", async () => {
    const response = await request(app)
      .post("/translate")
      .send({ text: "dog", language: "pl" });
    expect(response.body).toEqual("pies");
  });
  describe("should respond with a 400 status code when:", () => {
    test("user types number as input", async () => {
      const response = await request(app)
        .post("/translate")
        .send({ text: 11, language: "pl" });
      expect(response.statusCode).toBe(400);
    });
  });
});

// polly
// npm i -D jest typescript
// npm i -D ts-jest @types/jest
// npx ts-jest config:init
// npx jest

// dodac middleware
//
