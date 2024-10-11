import os

import yaml


class Config:
    def __init__(self):
        self.production = os.environ.get("ENV") == "production"

        cwd = os.getcwd()
        cfg = "config.production.yaml" if self.production is True else "config.yaml"
        path = f"{cwd}/{cfg}"

        file = open(path)
        data = yaml.load(file, Loader=yaml.SafeLoader)
        file.close()

        self.django_secret = data["django_secret"]
        self.webhook_secret = data["webhook_secret"]

        self.venv_path = data["venv_path"]
        self.app_path = data["app_path"]

        self.allowed_hosts = data["allowed_hosts"]
        self.allowed_origins = data["allowed_origins"]

        self.mysql_name = data["mysql"]["name"]
        self.mysql_user = data["mysql"]["user"]
        self.mysql_pass = data["mysql"]["pass"]
        self.mysql_host = data["mysql"]["host"]
        self.mysql_port = data["mysql"]["port"]
