from typing import List

from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import LatestDto
from ..bandcamp.services import BandcampService
from ..soundcloud.services import SoundcloudService
from ..utils.get_entity_type import get_entity_type
from ..utils.proxy import Proxy
from ..youtube.services import YoutubeService

router = Router()


@router.get("/", response=List[LatestDto])
def index(request: WSGIRequest):
    limit = 10
    youtube_results = YoutubeService.find_latest(limit)
    soundcloud_results = SoundcloudService.find_latest(limit)
    bandcamp_results = BandcampService.find_latest(limit)

    results = [*youtube_results, *soundcloud_results, *bandcamp_results]
    results = sorted(results, key=lambda x: x.updated_at, reverse=True)
    results = results[:limit]

    dtos: List[LatestDto] = []

    for result in results:
        type_ = get_entity_type(result)
        image = Proxy.screen_image(type_, result.id)
        audio = Proxy.screen_audio(type_, result.id)

        dto = LatestDto(
            id=result.id,
            title=result.title,
            hits=result.hits,
            type=type_,
            image=image,
            audio=audio,
            updated_at=result.updated_at,
        )

        dtos.append(dto)

    return dtos
