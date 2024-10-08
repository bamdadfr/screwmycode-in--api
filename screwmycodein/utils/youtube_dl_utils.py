from functools import wraps
from typing import Callable, Tuple

from django.core.handlers.wsgi import WSGIRequest
from yt_dlp import YoutubeDL

YoutubeDlInfo = Tuple[str, str, str]


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

            title = info.get("title")
            image = info.get("thumbnails")[-1].get("url")

            formats = info.get("formats", [])
            for f in formats:
                if f["format_id"] == format_id:
                    audio = f["url"]
                    break

        return title, audio, image
