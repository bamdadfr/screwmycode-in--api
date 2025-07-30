import time
from typing import TypedDict

import jwt
from django.conf import settings

from screwmycodein.db.media_model import MediaModel
from screwmycodein.v2.interfaces import MediaType


class MediaDto(TypedDict):
    url: str
    type: MediaType
    exp: int


def encode_media(media: MediaModel, media_type: MediaType) -> str:
    media_dto: MediaDto = {
        "url": media.url,
        "type": media_type,
        "exp": int(time.time()) + (24 * 60 * 60),  # 24 hours from now
    }

    token = jwt.encode(
        media_dto,  # type: ignore
        settings.JWT_SECRET,
        algorithm="HS256",
    )

    return token


def decode_media_url(token: str) -> MediaDto:
    media_dto: MediaDto = jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=["HS256"],
    )

    return media_dto
