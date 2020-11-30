#

<p align=center>
  <a href="https://api.screwmycode.in/"><img width=100 src="https://raw.githubusercontent.com/screwmycode/screwmycode-www/master/src/components/icons/SCRW_CHAMP.svg"></a>
</p>

<p align=center>
  Variable speed pitch control for <a href="https://www.youtube.com/">YouTube</a>
</p>

<p align=center>
  <a href="https://github.com/screwmycode/screwmycode-api"><img src="https://img.shields.io/github/stars/screwmycode/screwmycode-api?label=git"></a>
  <img src="https://img.shields.io/github/license/screwmycode/screwmycode-api">
</p>

<p align=center>
  <img src="https://img.shields.io/github/languages/count/screwmycode/screwmycode-api">
  <img src="https://img.shields.io/github/languages/top/screwmycode/screwmycode-api">
</p>

<p align=center>
  <img src="https://img.shields.io/github/v/release/screwmycode/screwmycode-api">
  <img src="https://api.codeclimate.com/v1/badges/43b9b1c5b6357b7a10fa/maintainability" />
</p>

<p align=center>
  <img src="https://img.shields.io/david/screwmycode/screwmycode-api">
  <img src="https://img.shields.io/david/dev/screwmycode/screwmycode-api">
  <img src="https://img.shields.io/snyk/vulnerabilities/github/screwmycode/screwmycode-api">
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
