from typing import Literal

import requests
from django.http import StreamingHttpResponse

from .get_domain import get_domain
from ..audio.models import Audio

EndpointType = Literal["audio", "image"]


class Proxy:
    @staticmethod
    def check_remote_available(url: str) -> bool:
        try:
            response = requests.head(url)
            return response.status_code == 200
        except Exception as e:
            print(e)
            return False

    @staticmethod
    def stream_remote(
        url: str,
        expires_hours: int,
        chunk_size: int = 1024 * 1024,
    ) -> StreamingHttpResponse:

        response = requests.get(url, stream=True)
        streaming = StreamingHttpResponse(
            response.iter_content(chunk_size=chunk_size),
            content_type=response.headers["Content-Type"],
        )

        # copy headers
        headers_to_copy = [
            "Accept-Ranges",
            "Content-Length",
            "X-Content-Type-Options",
            "Date",
            "Expires",
            "Cache-Control",
            "Age",
        ]
        for response_header in response.headers:
            if response_header not in headers_to_copy:
                continue

            streaming.headers[response_header] = response.headers[response_header]

        return streaming

    @staticmethod
    def __screen_endpoint(
        endpoint_type: EndpointType,
        audio: Audio,
    ) -> str:
        domain = get_domain()
        return f"{domain}/{audio.type}/{audio.slug}/{endpoint_type}"

    @staticmethod
    def screen_image(audio: Audio):
        return Proxy.__screen_endpoint("image", audio)

    @staticmethod
    def screen_audio(audio: Audio):
        return Proxy.__screen_endpoint("audio", audio)
