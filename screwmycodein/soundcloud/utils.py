import re
from typing import Callable, Tuple

from django.core.handlers.wsgi import WSGIRequest

from .dto import SoundcloudDto
from .models import Soundcloud
from ..utils.proxy import Proxy
from ..utils.youtube_dl_utils import YoutubeDlUtil

Title = str
Audio = str
Image = str
Info = Tuple[Title, Audio, Image]


class SoundcloudUtil:
    format_id = "http_mp3_128"

    @staticmethod
    def validate_id(callback: Callable):
        def decorator(request: WSGIRequest, artist: str, name: str):
            try:
                soundcloud_id = SoundcloudUtil.get_id(artist, name)
                id_regex = re.compile(r"^(.*)$")
                is_valid = bool(id_regex.match(soundcloud_id.strip()))

                if not is_valid:
                    raise ValueError(f"Soundcloud id is not valid")

                return callback(request, artist, name)
            except ValueError as e:
                return 404, f"{e}"

        return decorator

    @staticmethod
    def get_id(artist: str, name: str) -> str:
        return f"{artist}/{name}"

    @staticmethod
    def get_url(id_: str) -> str:
        url = f"https://www.soundcloud.com/{id_}"
        return url

    @staticmethod
    def get_info(id_: str) -> Info:
        url = SoundcloudUtil.get_url(id_)
        return YoutubeDlUtil.extract_info(url, SoundcloudUtil.format_id)

    @staticmethod
    def serialize(soundcloud: Soundcloud) -> SoundcloudDto:
        return {
            "id": soundcloud.id,
            "hits": soundcloud.hits,
            "title": soundcloud.title,
            "image": Proxy.screen_image("soundcloud", soundcloud.id),
            "audio": Proxy.screen_audio("soundcloud", soundcloud.id),
        }
