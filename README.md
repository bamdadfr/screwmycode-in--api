# [@screwmycode/screwmycode-api](https://github.com/screwmycode/screwmycode-api)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3df62fb1146c4c99b517413cbb61e869)](https://www.codacy.com/gh/screwmycode/screwmycode-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=screwmycode/screwmycode-api&amp;utm_campaign=Badge_Grade)
![David](https://img.shields.io/david/screwmycode/screwmycode-api)
![David](https://img.shields.io/david/dev/screwmycode/screwmycode-api)

API for [screwmycode-www](https://github.com/screwmycode/screwmycode-www)

API available [here](https://api.screwmycode.in)

## dev

### get source

```bash
git clone https://github.com/screwmycode/screwmycode-api
cd screwmycode-api
```

### local mongo database

`mongo-express` available at <http://localhost:8081>

```bash
# start
yarn dev:mongo:start

# stop
yarn dev:mongo:stop
```

### app

runs app at <http://localhost:3000>

```bash
# install dependencies
yarn

# run
yarn dev
```

## prod

CI/CD pipelines happen on `master` branch.

Automatic release at 04:30 UTC everyday.

You can force a release by adding `[force-release]` to your commit message
