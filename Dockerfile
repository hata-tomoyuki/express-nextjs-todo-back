# Node.js ベースイメージ
FROM node:18-alpine

# MySQLクライアントとOpenSSLのインストール
RUN apk add --no-cache openssl mysql-client

# 作業ディレクトリ設定
WORKDIR /app

# パッケージファイルをコピー
COPY package.json yarn.lock ./

# 環境に応じた依存関係のインストール
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ]; then \
        yarn install; \
    else \
        yarn install --production; \
    fi

# アプリケーションコードをコピー
COPY . .

# ポートの公開
EXPOSE 8080

# 環境に応じた起動コマンドを設定
CMD if [ "$CMD_ENV" = "development" ]; then \
        yarn dev; \
    else \
        yarn start; \
    fi
