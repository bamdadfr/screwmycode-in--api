from typing import Literal, Union

from ..bandcamp.models import Bandcamp
from ..soundcloud.models import Soundcloud
from ..youtube.models import Youtube

EntityType = Literal["youtube", "soundcloud", "bandcamp"]


def get_entity_type(
    entity: Union[Youtube, Soundcloud, Bandcamp],
) -> EntityType:
    if type(entity) is Youtube:
        return "youtube"

    if type(entity) is Soundcloud:
        return "soundcloud"

    if type(entity) is Bandcamp:
        return "bandcamp"

    raise ValueError(f"Unknown entity type: {type(entity)}")
