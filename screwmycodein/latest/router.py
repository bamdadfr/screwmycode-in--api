from typing import List

from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import LatestDto
from ..audio.services import AudioService
from ..hits.services import HitsService
from ..utils.proxy import Proxy

router = Router()


@router.get("/", response=List[LatestDto])
def index(request: WSGIRequest):
    rows = AudioService.find_latest(10)

    dtos: List[LatestDto] = []

    for row in rows:
        image = Proxy.screen_image(row)
        hits = HitsService.count_all(row)

        dto = LatestDto(
            slug=row.slug,
            title=row.title,
            hits=hits,
            type=row.type,
            image=image,
            updated_at=row.updated_at,
        )

        dtos.append(dto)

    return dtos
