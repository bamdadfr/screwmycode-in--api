from typing import TypedDict
from datetime import datetime, timedelta

import jwt
from django.conf import settings

from screwmycodein.db.media_model import MediaModel
from screwmycodein.v2.interfaces import MediaType


class MediaDto(TypedDict):
    url: str
    type: MediaType
    exp: int


def _get_normalized_expiration(
    hours_ahead: int = 24,
    leeway_seconds: int = 300,
) -> int:
    now = datetime.now()

    next_hour = now.replace(
        minute=0,
        second=0,
        microsecond=0,
    ) + timedelta(hours=hours_ahead)

    target_time = next_hour + timedelta(seconds=leeway_seconds)

    return int(target_time.timestamp())


def encode_media(media: MediaModel, media_type: MediaType) -> str:
    media_dto: MediaDto = {
        "url": media.url,
        "type": media_type,
        "exp": _get_normalized_expiration(),
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
