# Backend Project

このプロジェクトは、Next.jsとExpressを使用したTodoアプリ作成課題のバックエンド構築例です。
以下にプロジェクトのセットアップ、構成、および使用方法について説明します。

## 目次

1. [プロジェクトのセットアップ](#プロジェクトのセットアップ)
2. [ディレクトリ構造](#ディレクトリ構造)
3. [主要な設定ファイル](#主要な設定ファイル)
4. [スクリプト](#スクリプト)
5. [環境変数](#環境変数)
6. [開発](#開発)

## プロジェクトのセットアップ

このプロジェクトをローカルで実行するには、以下の手順に従ってください。

1. リポジトリをクローンします。

   ```bash
   git clone <https://github.com/hata-tomoyuki/express-nextjs-todo-back.git>
   cd backend
   ```

2. Dockerを使用してExpressアプリケーションとMySQLデータベースを起動します。

   ```bash
   docker-compose up -d
   ```

## ディレクトリ構造

- `src`: アプリケーションのソースコードが含まれています。
- `prisma`: Prismaのスキーマとマイグレーションファイルが含まれています。

## 主要な設定ファイル

- `.env`: 環境変数を定義するファイルです。
- `Dockerfile`: Dockerイメージをビルドするための設定ファイルです。
- `docker-compose.yml`: Dockerコンテナを管理するための設定ファイルです。
- `tsconfig.json`: TypeScriptのコンパイルオプションを定義するファイルです。

## スクリプト

- `yarn dev`: 開発サーバーを起動します。
- `yarn build`: プロジェクトをビルドします。`tsoa`を使用してAPI仕様とルートを生成し、TypeScriptをコンパイルします。
- `yarn start`: ビルドされたプロジェクトを起動します。
- `yarn lint`: コードのリントを実行します。
- `yarn lint:fix`: コードのリントとフォーマットを実行します。
- `yarn generate`: `swagger-typescript-api`を使用して、Swagger JSONからTypeScript APIクライアントを生成します。生成されたファイルは`frontend/schema`ディレクトリに出力されます。

## 環境変数

環境変数は`.env`ファイルに定義されており、プロジェクトの設定に使用されます。`.env.example`を参考にして、必要な変数を設定してください。

## 開発

開発中は、`docker-compose up -d`を使用してローカルサーバーを起動し、変更をリアルタイムで確認できます。
APIは `/docs` にアクセスしてSwagger UIで確認できます。
フロントエンド<https://github.com/hata-tomoyuki/express-nextjs-todo-front>でNext.jsアプリを起動して連携してください。
