from typing_extensions import TypedDict

from ..utils.get_entity_type import EntityType


class TopDto(TypedDict):
    id: str
    title: str
    hits: int
    type: EntityType
    image: str
    audio: str
