import request from "supertest";
import { app } from "..";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

describe("ユーザー API", () => {
  it("IDでユーザーを取得する", async () => {
    const testUser = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      },
    });
    const testUserId = testUser.id;
    const response = await request(app).get(`/users/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", testUserId);
  });

  it("ランダムなデータで新しいユーザーを作成する", async () => {
    const newUser = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    };
    const response = await request(app).post("/users").send(newUser);
    expect(response.status).toBe(204);
  });
});
