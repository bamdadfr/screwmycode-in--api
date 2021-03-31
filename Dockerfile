# build
FROM node:lts-alpine AS build

WORKDIR /app

COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# dependencies
FROM node:lts-alpine AS dependencies

ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# serve
FROM node:lts-alpine
LABEL maintainer="Bamdad Sabbagh <hi@bamdad.fr>"

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main"]