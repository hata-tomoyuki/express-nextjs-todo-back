FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN yarn install --production=false

COPY . .

EXPOSE 8080
CMD ["yarn", "dev"]
