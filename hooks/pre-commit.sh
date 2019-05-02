#!/bin/sh

# cd .git/hooks && ln -s ../../hooks/pre-commit.sh ./pre-commit.sh && chmod +x ./pre-commit.sh && cd ../../

# $PWD working dir
reactPath=.

$PWD/$reactPath/node_modules/.bin/eslint $reactPath/src --ext .js --fix

exit 0
