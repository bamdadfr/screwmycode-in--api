from datetime import datetime

from typing_extensions import TypedDict

from ..utils.get_entity_type import EntityType


class LatestDto(TypedDict):
    id: str
    title: str
    hits: int
    type: EntityType
    image: str
    audio: str
    updated_at: datetime
