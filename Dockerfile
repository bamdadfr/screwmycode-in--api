# production dependencies
FROM node:lts-alpine AS dependencies

ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# serve
FROM node:lts-alpine
LABEL maintainer="Bamdad Sabbagh <devops@bamdadsabbagh.com>"

ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock ecosystem.config.js ./
COPY ./src ./src
COPY --from=dependencies /app/node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "start"]
