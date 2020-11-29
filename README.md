#

<p align=center>
    API for <a href="https://github.com/screwmycode/screwmycode-www">screwmycode-www</a>
    <br/>
    API available <a href="https://api.screwmycode.in">here</a>
</p>

<p align=center>
    <img src="https://img.shields.io/github/v/release/screwmycode/screwmycode-api">
    <img src="https://api.codeclimate.com/v1/badges/9d8331cec24be05155cc/maintainability">
</p>

<p align=center>
    <img src="https://img.shields.io/david/screwmycode/screwmycode-api">
    <img src="https://img.shields.io/david/dev/screwmycode/screwmycode-api">
    <img src="https://img.shields.io/snyk/vulnerabilities/github/screwmycode/screwmycode-api">
</p>

<p align=center>
    <img src="https://img.shields.io/github/stars/screwmycode/screwmycode-api">
    <img src="https://img.shields.io/github/forks/screwmycode/screwmycode-api">
</p>

## get source

```bash
git clone https://github.com/screwmycode/screwmycode-api
cd screwmycode-api
```

## local mongo database

`mongo-express` available at <http://localhost:8081>

```bash
# start
yarn dev:mongo:start

# stop
yarn dev:mongo:stop
```

## app

runs app at <http://localhost:3000>

```bash
# install dependencies
yarn

# dev start
yarn start

# dev stop
yarn stop
```

## prod

CI/CD pipelines happen on `master` branch.

Automatic release at 04:30 UTC everyday.

You can force a release by adding `[force-release]` to your commit message
