from typing import Literal

from django.core.handlers.wsgi import WSGIRequest
import requests
from django.http import StreamingHttpResponse

from screwmycodein.screwmycodein.audio.models import Audio
from screwmycodein.screwmycodein.config import Config
from .get_domain import get_domain

EndpointType = Literal["audio", "image"]
config = Config()


class Proxy:
    @staticmethod
    def stream_remote(
        url: str,
        request: WSGIRequest | None = None,
    ) -> StreamingHttpResponse:
        response = requests.get(url, stream=True)

        streaming = StreamingHttpResponse(
            response.iter_content(chunk_size=1024 * 1024),
            content_type=response.headers["Content-Type"],
        )

        headers_to_copy = [
            "Accept-Ranges",
            "Content-Length",
            "X-Content-Type-Options",
            "Date",
            "Expires",
            "Cache-Control",
            "Age",
        ]

        for header in response.headers:
            if header not in headers_to_copy:
                continue

            streaming.headers[header] = response.headers[header]

        if request:
            origin = request.headers.get("Origin")

            if origin is None:
                return streaming

            allowed_origins = config.allowed_origins

            if origin in allowed_origins:
                streaming["Access-Control-Allow-Origin"] = origin
                streaming["Access-Control-Allow-Credentials"] = "true"
                streaming["Access-Control-Allow-Methods"] = "GET, OPTIONS"
                streaming["Access-Control-Allow-Headers"] = (
                    "Authorization, Content-Type"
                )

        return streaming

    @staticmethod
    def __screen_endpoint(
        endpoint_type: EndpointType,
        audio: Audio,
    ) -> str:
        domain = get_domain()
        return f"{domain}/{audio.type}/{audio.slug}/{endpoint_type}"

    @staticmethod
    def screen_image(row: Audio):
        return Proxy.__screen_endpoint("image", row)

    @staticmethod
    def screen_audio(row: Audio):
        if row.type == Audio.Type.SOUNDCLOUD:
            return Proxy.__screen_endpoint("audio", row)

        return row.audio
