from functools import wraps
from typing import Callable, NamedTuple, Tuple

from django.core.handlers.wsgi import WSGIRequest
from yt_dlp import YoutubeDL

from screwmycodein.v2.audio import get_audio_format, get_audio_type

YoutubeDlInfo = Tuple[str, str, str]


class ExtractedInfo(NamedTuple):
    title: str
    audio: str
    image: str


class YoutubeDlUtil:
    @staticmethod
    def catch_exceptions(callback: Callable):
        @wraps(callback)
        def wrapper(request: WSGIRequest, *args, **kwargs):
            try:
                return callback(request, *args, **kwargs)
            except Exception as e:
                return 404, f"{e}"

        return wrapper

    @staticmethod
    def extract_info(url: str, format_id: str) -> YoutubeDlInfo:
        options = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
        }

        title: str = ""
        image: str = ""
        audio: str = ""

        with YoutubeDL(options) as ydl:
            info = ydl.extract_info(url=url, download=False)

            title = info.get("title")  # type: ignore
            image = info.get("thumbnails")[-1].get("url")  # type: ignore
            formats = info.get("formats", [])  # type: ignore

            for f in formats:
                current_id: str = f["format_id"]

                if current_id.startswith(format_id):
                    audio = f["url"]
                    break

        return title, audio, image

    @staticmethod
    def extract_info_new(url: str) -> ExtractedInfo:
        options = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
        }

        audio_type = get_audio_type(url)
        audio_format = get_audio_format(audio_type)

        title: str = ""
        image: str = ""
        audio: str = ""

        with YoutubeDL(options) as ydl:
            info = ydl.extract_info(url=url, download=False)

            title = info.get("title")  # type: ignore
            image = info.get("thumbnails")[-1].get("url")  # type: ignore
            formats = info.get("formats", [])  # type: ignore

            for f in formats:
                current_id: str = f["format_id"]

                if current_id.startswith(audio_format):
                    audio = f["url"]
                    break

        return ExtractedInfo(
            title=title,
            audio=audio,
            image=image,
        )
