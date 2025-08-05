from functools import wraps
from typing import Callable, NamedTuple, Tuple

from django.core.handlers.wsgi import WSGIRequest
from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError

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
            "format": "best[protocol!*=m3u8]",
        }

        title: str | None = None
        image: str | None = None
        audio: str | None = None

        try:
            with YoutubeDL(options) as ydl:
                info = ydl.extract_info(url=url, download=False)

                if info is None:
                    raise ValueError("Not found")

                title = info.get("title")

                thumbnails = info.get("thumbnails", [])
                if thumbnails:
                    image = thumbnails[-1].get("url", "")

                if info.get("url"):
                    audio = info["url"]
                elif info.get("requested_formats"):
                    audio = info["requested_formats"][0].get("url", "")

            if title is None or image is None or audio is None:
                raise ValueError("Invalid values")

            return ExtractedInfo(
                title=title,
                audio=audio,
                image=image,
            )
        except DownloadError:
            raise ValueError("Failed download")
        except Exception:
            raise ValueError("Failed extracation")
