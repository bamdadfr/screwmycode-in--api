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
    ) -> StreamingHttpResponse:
        eightkb = 8192

        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
        }

        response = requests.get(url, headers=headers, stream=True)

        streaming = StreamingHttpResponse(
            response.iter_content(chunk_size=eightkb),
            content_type=response.headers["Content-Type"],
        )

        # copy headers
        allowed_headers = [
            "Accept-Ranges",
            "Content-Length",
            "X-Content-Type-Options",
            "Date",
            "Expires",
            "Cache-Control",
            "Age",
        ]
        for header in response.headers:
            if header not in allowed_headers:
                continue

            streaming.headers[header] = response.headers[header]

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
