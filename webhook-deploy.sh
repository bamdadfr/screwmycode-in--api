#!/bin/bash

venv_path="$1"
app_path="$2"
public_path="$3"

config_file="config.production.yaml"

source "${venv_path}" && cd "${app_path}" || exit 1

git fetch origin
git reset --hard origin/master
git clean -fd

ln -s "${app_path}"/php/stream.php "${public_path}"/stream.php
proxy_secret=$(grep '^proxy_secret:' "${app_path}/${config_file}" | sed 's/^proxy_secret: *//' | sed 's/^["\x27]\(.*\)["\x27]$/\1/')
sed -i "s/\$secret = 'proxy_secret';/\$secret = '$proxy_secret';/" "${app_path}/php/stream.php"

pip install --upgrade pip
pip install -r requirements.txt

python manage.py migrate
touch tmp/restart.txt

deactivate
