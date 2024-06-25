import os

from screwmycodein.config import Config


def get_domain() -> str:
    config = Config()

    if config.production is True:
        return "https://api.screwmycode.in"

    return "http://localhost:8000"
