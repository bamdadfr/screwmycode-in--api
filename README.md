<!--suppress HtmlDeprecatedAttribute, HtmlRequiredAltAttribute -->

<p align=center>
    <a href="https://api.screwmycode.in/">
        <img width=100 src="https://raw.githubusercontent.com/bamdadsabbagh/screwmycode-in--www/master/public/icons/SCRW_KSET.svg">
    </a>
</p>

<p align=center>
    Pitch control for <a href="https://www.youtube.com/">YouTube</a> & <a href="https://soundcloud.com/">SoundCloud</a>
</p>

<p align=center>
    <a href="https://github.com/bamdadsabbagh/screwmycode-in--api">
        <img src="https://img.shields.io/github/stars/bamdadsabbagh/screwmycode-in--api?label=git">
    </a>
    <img src="https://img.shields.io/github/license/bamdadsabbagh/screwmycode-in--api">
</p>

<p align=center>
    <img src="https://img.shields.io/github/languages/count/bamdadsabbagh/screwmycode-in--api">
    <img src="https://img.shields.io/github/languages/top/bamdadsabbagh/screwmycode-in--api">
</p>

<p align=center>
    <img src="https://img.shields.io/github/v/release/bamdadsabbagh/screwmycode-in--api">
    <img src="https://api.codeclimate.com/v1/badges/9d8331cec24be05155cc/maintainability">
    <img src="https://codecov.io/gh/bamdadsabbagh/screwmycode-in--api/branch/master/graph/badge.svg?token=UOD356LWLX">
</p>

<p align=center>
    <img src="https://img.shields.io/david/bamdadsabbagh/screwmycode-in--api">
    <img src="https://img.shields.io/david/dev/bamdadsabbagh/screwmycode-in--api">
    <img src="https://img.shields.io/snyk/vulnerabilities/github/bamdadsabbagh/screwmycode-in--api">
</p>

<p align=center>
    <img src="https://img.shields.io/badge/ci-github--actions-yellowgreen">
    <img src="https://img.shields.io/badge/cd-docker-yellowgreen">
</p>

## Get Started

### Source

```bash
git clone https://github.com/bamdadsabbagh/screwmycode-in--api
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
    docker.pkg.github.com/bamdadsabbagh/screwmycode-in--api/screwmycode-in--api:latest
```
