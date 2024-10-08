from typing import List

from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import TopDto
from ..audio.services import AudioService
from ..hits.services import HitsService
from ..utils.proxy import Proxy

router = Router()


@router.get("/", response=List[TopDto])
def index(request: WSGIRequest):
    rows = AudioService.find_top(10)

    dtos: List[TopDto] = []

    for row in rows:
        image = Proxy.screen_image(row)
        audio = Proxy.screen_audio(row)
        hits = HitsService.count_all(row)

        dto = TopDto(
            slug=row.slug,
            title=row.title,
            hits=hits,
            type=row.type,
            image=image,
            audio=audio,
        )

        dtos.append(dto)

    return dtos
