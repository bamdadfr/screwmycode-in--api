from typing import List

from django.db.models import QuerySet

from screwmycodein.audio.models import Audio
from .dto import TopDto
from ..hits.services import HitsService
from ..utils.proxy import Proxy


class TopUtil:
    @staticmethod
    def serialize(rows: QuerySet[Audio]) -> List[TopDto]:
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
