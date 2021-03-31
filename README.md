# screwmycode/screwmycode-api

<!--suppress HtmlDeprecatedAttribute -->

<p align=center>
    <a href="https://api.screwmycode.in/">
        <img alt="logo" width=100 src="https://raw.githubusercontent.com/screwmycode/screwmycode-www/master/src/assets/icons/SCRW_CHAMP.svg">
    </a>
</p>

<p align=center>
    Variable speed pitch control for <a href="https://www.youtube.com/">YouTube</a>
</p>

<p align=center>
    <a href="https://github.com/screwmycode/screwmycode-api">
        <img alt="github stars" src="https://img.shields.io/github/stars/screwmycode/screwmycode-api?label=git">
    </a>
    <img alt="license" src="https://img.shields.io/github/license/screwmycode/screwmycode-api">
</p>

<p align=center>
    <img alt="languages used" src="https://img.shields.io/github/languages/count/screwmycode/screwmycode-api">
    <img alt="languages top" src="https://img.shields.io/github/languages/top/screwmycode/screwmycode-api">
</p>

<p align=center>
    <img alt="release version" src="https://img.shields.io/github/v/release/screwmycode/screwmycode-api">
    <img alt="code climate" src="https://api.codeclimate.com/v1/badges/9d8331cec24be05155cc/maintainability">
</p>

<p align=center>
    <img alt="dependencies" src="https://img.shields.io/david/screwmycode/screwmycode-api">
    <img alt="dev dependencies" src="https://img.shields.io/david/dev/screwmycode/screwmycode-api">
    <img alt="snyk vulnerabilities" src="https://img.shields.io/snyk/vulnerabilities/github/screwmycode/screwmycode-api">
</p>

<p align=center>
    <img alt="ci" src="https://img.shields.io/badge/ci-github--actions-yellowgreen">
    <img alt="cd" src="https://img.shields.io/badge/cd-docker-yellowgreen">
</p>

## Get Started

### Source

```bash
git clone https://github.com/screwmycode/screwmycode-api
cd screwmycode-api
yarn
```

### Database

You will need a `MongoDB` instance.

Credentials to the database are provided through `environment` variables.

Create a `.env` file in the root directory.

```dotenv
MONGO_HOST=my.mongodb.url/database # '/database' is optional
MONGO_USER=myMongoUser
MONGO_PASS=myMongoPassword
```

#### If you do not have a `MongoDB` instance

You will need `docker-compose` installed and run the following command.

```bash
docker-compose -f dev/mongo.docker-compose.yml up # add flag '-d' to put in background
```

The above command creates a database and a [mongo-express](https://github.com/mongo-express/mongo-express) web admin
interface on port `8081`

Then, create a `.env` file

```bash
MONGO_HOST=localhost
MONGO_USER=root
MONGO_PASS=root
```

### Start application

```bash
yarn start:dev
```

## Deployment

Change `Docker` environment variables accordingly, you can also pass a `.env` file.

If your `Docker` image contains a `.env` file, it will be ignored.

```bash
docker run \
    -d \
    --restart=always \
    --name screwmycode-api \
    -e MONGO_HOST=my.mongodb.url/database \
    -e MONGO_USER=myMongoUser \
    -e MONGO_PASS=myMongoPassword \
    -p 3000:3000 \
    docker.pkg.github.com/screwmycode/screwmycode-api/screwmycode-api:latest
```
