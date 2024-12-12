import { Body, Controller, Get, Path, Post, Route, Response } from "tsoa";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { tokenBlacklist } from "..";
import { SECRET_KEY } from "../config";
import { ValidateErrorJSON } from "../types";

const prisma = new PrismaClient();

type UserCreationParams = Pick<User, "email" | "name" | "password">;

type LoginParams = Pick<User, "email" | "password">;

@Route("users")
export class UsersController extends Controller {
  @Response<ValidateErrorJSON>(404, "User Not Found")
  @Get("{userId}")
  public async getUser(@Path() userId: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @Response<ValidateErrorJSON>(409, "Conflict")
  @Post("register")
  public async createUser(
    @Body() requestBody: UserCreationParams,
  ): Promise<{ message: string; details?: any } | void> {
    const { email, password, name } = requestBody;
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      this.setStatus(409);
      return {
        message: "メールアドレスは既に存在します",
        details: { email: "このメールアドレスは既に登録されています。" },
      };
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      this.setStatus(201);
    } catch (error) {
      console.error(error);
      this.setStatus(500);
      return { message: "ユーザーの作成に失敗しました" };
    }
  }

  @Response<ValidateErrorJSON>(404, "User Not Found")
  @Response<ValidateErrorJSON>(401, "Invalid Password")
  @Post("login")
  public async loginUser(
    @Body() requestBody: LoginParams,
  ): Promise<{ token?: string; userId?: number; message?: string } | null> {
    const user = await prisma.user.findUnique({
      where: { email: requestBody.email },
    });

    if (!user) {
      this.setStatus(404);
      return { message: "ユーザーが見つかりません" };
    }
    const isPasswordValid = await bcrypt.compare(
      requestBody.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.setStatus(401);
      return { message: "無効なパスワードです" };
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    this.setStatus(200);
    return { token, userId: user.id };
  }

  @Post("logout")
  public async logoutUser(
    @Body() requestBody: { token: string },
  ): Promise<{ message?: string } | void> {
    if (requestBody.token) {
      tokenBlacklist.add(requestBody.token);
      this.setStatus(200);
      return;
    }
    this.setStatus(400);
    return { message: "トークンが提供されていません" };
  }
}
