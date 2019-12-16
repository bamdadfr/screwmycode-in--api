#!/bin/bash
# add to npm scripts:
# "git": "hooks/git.sh"

# cd into script dir
cd "$(dirname "${BASH_SOURCE[0]}")"
cd ..

# ask user for commit message
IFS= read -r -p "Please enter a commit message: " commit

# eslint
node_modules/.bin/eslint src --ext .js --fix

# build query and execute
query="git add . && git commit -m \""$commit"\" && git push"
eval "$query"
