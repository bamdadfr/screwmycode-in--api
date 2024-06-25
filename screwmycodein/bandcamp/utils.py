from typing import Tuple

from .dto import BandcampDto
from .models import Bandcamp
from ..utils.proxy import Proxy
from ..utils.youtube_dl_utils import YoutubeDlUtil

Title = str
Audio = str
Image = str
Info = Tuple[Title, Audio, Image]


class BandcampUtil:
    format_id = "mp3-128"

    @staticmethod
    def get_id(artist: str, name: str) -> str:
        return f"{artist}/{name}"

    @staticmethod
    def split_id(id_: str) -> Tuple[str, str]:
        artist, name = id_.split("/")
        return artist, name

    @staticmethod
    def get_url(id_: str) -> str:
        artist, name = BandcampUtil.split_id(id_)
        url = f"https://{artist}.bandcamp.com/track/{name}"
        return url

    @staticmethod
    def get_info(id_: str) -> Info:
        url = BandcampUtil.get_url(id_)
        return YoutubeDlUtil.extract_info(url, BandcampUtil.format_id)

    @staticmethod
    def serialize(bandcamp: Bandcamp) -> BandcampDto:
        return {
            "id": bandcamp.id,
            "hits": bandcamp.hits,
            "title": bandcamp.title,
            "image": Proxy.screen_image("bandcamp", bandcamp.id),
            "audio": Proxy.screen_audio("bandcamp", bandcamp.id),
        }
