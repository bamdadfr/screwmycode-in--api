from typing import Tuple

from ..utils.youtube_dl_utils import YoutubeDlUtil, YoutubeDlInfo


class BandcampUtil:
    format_id = "mp3-128"

    @staticmethod
    def get_slug(artist: str, name: str) -> str:
        return f"{artist}/{name}"

    @staticmethod
    def split_id(id_: str) -> Tuple[str, str]:
        artist, name = id_.split("/")
        return artist, name

    @staticmethod
    def get_url(slug: str) -> str:
        artist, name = BandcampUtil.split_id(slug)
        url = f"https://{artist}.bandcamp.com/track/{name}"
        return url

    @staticmethod
    def get_info(slug: str) -> YoutubeDlInfo:
        url = BandcampUtil.get_url(slug)
        return YoutubeDlUtil.extract_info(url, BandcampUtil.format_id)
