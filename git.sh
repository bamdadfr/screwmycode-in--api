#!/bin/bash

# cd into script dir
cd "$(dirname "${BASH_SOURCE[0]}")"

# ask user for commit message
IFS= read -r -p "Please enter a commit message: " commit

# linting
if [ "$1" != "" ] && [ "$1" == "lint" ]
then
    node_modules/.bin/eslint src --ext .js --fix
fi

# build query and execute
query="git add . && git commit -m \""$commit"\" && git push"
eval "$query"
