# build
FROM node:lts-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json tsconfig.build.json ./
RUN pnpm i

COPY . .
RUN pnpm build

# dependencies
FROM node:lts-alpine AS dependencies

ENV NODE_ENV=production
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

# serve
FROM node:lts-alpine
LABEL maintainer="Bamdad Sabbagh <hi@bamdad.fr>"

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
