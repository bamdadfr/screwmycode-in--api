import re
from typing import Callable

from django.core.handlers.wsgi import WSGIRequest

from screwmycodein.screwmycodein.exceptions import InvalidSlugException
from ..utils.youtube_dl_utils import YoutubeDlUtil, YoutubeDlInfo


class YoutubeUtil:
    format_id = "140"

    @staticmethod
    def validate_id(callback: Callable):
        # TODO: add wrapping
        def decorator(request: WSGIRequest, youtube_id: str):
            try:
                id_regex = re.compile(r"^[a-zA-Z0-9-_]{11}$")
                is_valid = bool(id_regex.match(youtube_id.strip()))

                if not is_valid:
                    raise InvalidSlugException

                return callback(request, youtube_id)
            except InvalidSlugException as e:
                return 404, f"{e}"

        return decorator

    @staticmethod
    def get_url(slug: str) -> str:
        url = f"https://www.youtube.com/watch?v={slug}"
        return url

    @staticmethod
    def get_info(slug: str) -> YoutubeDlInfo:
        url = YoutubeUtil.get_url(slug)
        return YoutubeDlUtil.extract_info(url, YoutubeUtil.format_id)
