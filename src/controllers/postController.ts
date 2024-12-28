import {
  Controller,
  Get,
  Post,
  Route,
  Body,
  Security,
  Request,
  Put,
  Delete,
  Response,
} from "tsoa";
import {
  PrismaClient,
  Post as PostModel,
  User as UserModel,
} from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/authenticate";
import { ValidateErrorJSON } from "../types";

const prisma = new PrismaClient();

type PostCreationParams = Pick<PostModel, "title" | "content">;
type PostUpdateParams = Pick<PostModel, "title" | "content" | "published">;
type PostWithAuthor = PostModel & { author: UserModel };

@Route("posts")
@Security("jwt")
export class PostController extends Controller {
  @Response<ValidateErrorJSON>(500, "Internal Server Error")
  @Get()
  public async getAllPosts(): Promise<PostModel[] | { message: string }> {
    try {
      const posts = await prisma.post.findMany({
        where: { published: true },
      });
      return posts;
    } catch (error) {
      this.setStatus(500);
      console.error(error);
      return { message: "Failed to retrieve posts" };
    }
  }

  @Response<ValidateErrorJSON>(500, "Internal Server Error")
  @Get("user/{userId}/posts")
  public async getPostsByUser(
    userId: number,
  ): Promise<PostModel[] | { message: string }> {
    try {
      const posts = await prisma.post.findMany({
        where: { authorId: userId },
      });
      return posts;
    } catch (error) {
      this.setStatus(500);
      console.error(error);
      return { message: "Failed to retrieve user's posts" };
    }
  }

  @Response<ValidateErrorJSON>(400, "Invalid request")
  @Response<ValidateErrorJSON>(401, "Unauthorized")
  @Post()
  public async createPost(
    @Request() request: AuthenticatedRequest,
    @Body() requestBody: PostCreationParams,
  ): Promise<{ message?: string } | void> {
    const { title, content } = requestBody;
    const authorId = request.user?.userId;

    if (authorId === undefined) {
      this.setStatus(401);
      return { message: "著者IDが定義されていません" };
    }

    if (content === null) {
      this.setStatus(400);
      return { message: "コンテンツはnullにできません" };
    }

    await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });
    this.setStatus(201);
  }

  @Response<ValidateErrorJSON>(404, "Post not found")
  @Get("post/{postId}")
  public async getPost(postId: number): Promise<PostWithAuthor | null> {
    const post = await prisma.post.findFirst({
      where: { id: postId },
      include: { author: true },
    });
    if (!post) {
      this.setStatus(404);
      return null;
    }
    return post;
  }

  @Response<ValidateErrorJSON>(400, "Invalid request")
  @Response<ValidateErrorJSON>(401, "Unauthorized")
  @Put("user/{userId}/post/{postId}")
  public async updatePost(
    @Request() request: AuthenticatedRequest,
    userId: number,
    postId: number,
    @Body() requestBody: PostUpdateParams,
  ): Promise<{ message?: string } | void> {
    const { title, content, published } = requestBody;
    const requestUserId = request.user?.userId;

    if (!requestUserId || requestUserId !== userId) {
      this.setStatus(401);
      return {
        message:
          "認証されていません: ユーザーIDが定義されていないか一致しません",
      };
    }

    if (content === null) {
      this.setStatus(400);
      return { message: "コンテンツは必須です" };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { title, content, published },
    });
  }

  @Response<ValidateErrorJSON>(401, "Unauthorized")
  @Delete("user/{userId}/post/{postId}")
  public async deletePost(
    @Request() request: AuthenticatedRequest,
    userId: number,
    postId: number,
  ): Promise<{ message?: string } | void> {
    const requestUserId = request.user?.userId;

    if (!requestUserId || requestUserId !== userId) {
      this.setStatus(401);
      return {
        message:
          "認証されていません: ユーザーIDが定義されていないか一致しません",
      };
    }

    await prisma.post.deleteMany({
      where: { id: postId, authorId: userId },
    });
  }
}
