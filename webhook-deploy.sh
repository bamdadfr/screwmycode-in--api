#!/bin/bash

venv_path="$1"
app_path="$2"

# shellcheck source=./deploy.sh
source "${venv_path}" && cd "${app_path}" || exit 1
git pull

pip install --upgrade pip
pip install -r requirements.txt

python manage.py migrate
touch tmp/restart.txt

deactivate
