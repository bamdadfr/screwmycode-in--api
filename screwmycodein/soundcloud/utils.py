import re
from typing import Callable

from django.core.handlers.wsgi import WSGIRequest

from ..utils.youtube_dl_utils import YoutubeDlUtil, YoutubeDlInfo


class SoundcloudUtil:
    format_id = "http_mp3_128"

    @staticmethod
    def validate_id(callback: Callable):
        def decorator(request: WSGIRequest, artist: str, name: str):
            try:
                soundcloud_id = SoundcloudUtil.get_slug(artist, name)
                id_regex = re.compile(r"^(.*)$")
                is_valid = bool(id_regex.match(soundcloud_id.strip()))

                if not is_valid:
                    raise ValueError("Soundcloud id is not valid")

                return callback(request, artist, name)
            except ValueError as e:
                return 404, f"{e}"

        return decorator

    @staticmethod
    def get_slug(artist: str, name: str) -> str:
        return f"{artist}/{name}"

    @staticmethod
    def get_url(id_: str) -> str:
        url = f"https://www.soundcloud.com/{id_}"
        return url

    @staticmethod
    def get_info(id_: str) -> YoutubeDlInfo:
        url = SoundcloudUtil.get_url(id_)
        return YoutubeDlUtil.extract_info(url, SoundcloudUtil.format_id)
