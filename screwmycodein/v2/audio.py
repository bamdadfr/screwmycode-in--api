from typing import Literal

import requests


def check_is_remote_available(url: str) -> bool:
    try:
        response = requests.head(url)
        return response.status_code == 200
    except Exception:
        return False


AudioType = Literal["soundcloud", "youtube", "bandcamp"]


def get_audio_type(url: str) -> AudioType:
    audio_type: AudioType
    is_youtube = "youtube.com" in url
    is_soundcloud = "soundcloud.com" in url
    is_bandcamp = "bandcamp.com" in url

    if is_youtube:
        audio_type = "youtube"
    elif is_soundcloud:
        audio_type = "soundcloud"
    elif is_bandcamp:
        audio_type = "bandcamp"
    else:
        raise ValueError()

    return audio_type


AudioFormat = dict[AudioType, str]

_audio_format_by_type: AudioFormat = {
    "soundcloud": "http_mp3",
    "youtube": "140",
    "bandcamp": "mp3-128",
}


def get_audio_format(audio_type: AudioType) -> str:
    return _audio_format_by_type[audio_type]
