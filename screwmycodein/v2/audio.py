from urllib.parse import urlparse

import requests


def check_is_remote_available(url: str) -> bool:
    try:
        response = requests.head(url)
        return response.status_code == 200
    except Exception:
        return False


def validate_provider(url: str) -> None:
    try:
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()

        if domain.startswith("www."):
            domain = domain[4:]

        if domain == "youtube.com" or domain.endswith(".youtube.com"):
            return
        elif domain == "soundcloud.com" or domain.endswith(".soundcloud.com"):
            return
        elif domain.endswith(".bandcamp.com"):
            return

        raise ValueError(f"Unsupported audio service domain: {domain}")

    except Exception as e:
        raise ValueError(f"Invalid URL or unsupported service: {e}")
