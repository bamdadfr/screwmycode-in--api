from typing import Literal
from urllib.parse import urlparse
import requests


def check_is_remote_available(url: str) -> bool:
    try:
        response = requests.head(url)
        return response.status_code == 200
    except Exception:
        return False


AudioType = Literal["soundcloud", "youtube", "bandcamp"]


def get_audio_type(url: str) -> AudioType:
    try:
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()

        if domain.startswith("www."):
            domain = domain[4:]

        if domain == "youtube.com" or domain.endswith(".youtube.com"):
            return "youtube"
        elif domain == "soundcloud.com" or domain.endswith(".soundcloud.com"):
            return "soundcloud"
        elif domain.endswith(".bandcamp.com"):
            return "bandcamp"
        else:
            raise ValueError(f"Unsupported audio service domain: {domain}")

    except Exception as e:
        raise ValueError(f"Invalid URL or unsupported service: {e}")


AudioFormat = dict[AudioType, str]

_audio_format_by_type: AudioFormat = {
    "soundcloud": "http_mp3",
    "youtube": "140",
    "bandcamp": "mp3-128",
}


def get_audio_format(audio_type: AudioType) -> str:
    return _audio_format_by_type[audio_type]
