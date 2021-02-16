# screwmycode/screwmycode-api

<!--suppress HtmlDeprecatedAttribute -->
<p align=center>
    <a href="https://api.screwmycode.in/">
        <img width=100 src="https://raw.githubusercontent.com/screwmycode/screwmycode-www/master/src/assets/icons/SCRW_CHAMP.svg" alt="logo">
    </a>
</p>

<p align=center>
    Variable speed pitch control for <a href="https://www.youtube.com/">YouTube</a>
</p>

<p align=center>
    <a href="https://github.com/screwmycode/screwmycode-api">
        <img src="https://img.shields.io/github/stars/screwmycode/screwmycode-api?label=git" alt="git">
    </a>
    <img src="https://img.shields.io/github/license/screwmycode/screwmycode-api" alt="license">
</p>

<p align=center>
    <img src="https://img.shields.io/github/languages/count/screwmycode/screwmycode-api" alt="languages-count">
    <img src="https://img.shields.io/github/languages/top/screwmycode/screwmycode-api" alt="languages-top">
</p>

<p align=center>
    <img src="https://img.shields.io/github/v/release/screwmycode/screwmycode-api" alt="release">
    <img src="https://api.codeclimate.com/v1/badges/9d8331cec24be05155cc/maintainability" alt="codeclimate">
</p>

<p align=center>
    <img src="https://img.shields.io/david/screwmycode/screwmycode-api" alt="dependencies">
    <img src="https://img.shields.io/david/dev/screwmycode/screwmycode-api" alt="dev-dependencies">
    <img src="https://img.shields.io/snyk/vulnerabilities/github/screwmycode/screwmycode-api" alt="vulnerabilities">
</p>

<p align=center>
    <img src="https://img.shields.io/badge/ci-github--actions-yellowgreen" alt="ci">
    <img src="https://img.shields.io/badge/cd-docker-yellowgreen" alt="cd">
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
yarn dev:start:mongo

# stop
yarn dev:stop:mongo
```

## app

runs app at <http://localhost:3000>

```bash
# install dependencies
yarn

# dev start
yarn dev

# dev stop
yarn stop
```
