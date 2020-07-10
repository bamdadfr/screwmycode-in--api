# [@screwmycode/screwmycode-api](https://github.com/screwmycode/screwmycode-api)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3df62fb1146c4c99b517413cbb61e869)](https://www.codacy.com/gh/screwmycode/screwmycode-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=screwmycode/screwmycode-api&amp;utm_campaign=Badge_Grade)

API for [screwmycode-www](https://github.com/screwmycode/screwmycode-www)

API available [here](https://api.screwmycode.in)

## dev

```bash
# get repo
git clone https://github.com/screwmycode/screwmycode-api
cd screwmycode-api

# install dependencies
yarn

# start dev mongo service
docker-compose -f dev/docker-compose.yml up -d

# start app available at http://localhost:3000/
yarn start
```

## prod

CI/CD pipelines happen on `master` branch.

Automatic release at 04:30 UTC everyday.

You can force a release by adding `[force-release]` to your commit message
