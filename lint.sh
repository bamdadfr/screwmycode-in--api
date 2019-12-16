#!/bin/bash
cd "$(dirname "${BASH_SOURCE[0]}")"
node_modules/.bin/eslint src --ext .js --fix
