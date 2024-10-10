from datetime import datetime

from typing_extensions import TypedDict


class LatestDto(TypedDict):
    slug: str
    title: str
    hits: int
    type: str
    image: str
    updated_at: datetime
