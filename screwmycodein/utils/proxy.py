from typing import Literal

import requests
from django.http import StreamingHttpResponse

from .get_domain import get_domain
from .get_entity_type import EntityType

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
    def stream_remote(url: str, chunk_size=1024 * 1024) -> StreamingHttpResponse:
        response = requests.get(url, stream=True)
        content_type = response.headers["content-type"]

        streaming = StreamingHttpResponse(
            response.iter_content(chunk_size=chunk_size),
            content_type=content_type,
        )

        return streaming

    @staticmethod
    def __screen_endpoint(
        endpoint_type: EndpointType,
        entity_type: EntityType,
        id_: str,
    ) -> str:
        domain = get_domain()
        return f"{domain}/{entity_type}/{id_}/{endpoint_type}"

    @staticmethod
    def screen_image(entity_type: EntityType, id_: str):
        return Proxy.__screen_endpoint("image", entity_type, id_)

    @staticmethod
    def screen_audio(entity_type: EntityType, id_: str):
        return Proxy.__screen_endpoint("audio", entity_type, id_)
