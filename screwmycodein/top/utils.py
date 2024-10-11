from typing import List

from django.db.models import QuerySet

from screwmycodein.screwmycodein.audio.models import Audio
from screwmycodein.screwmycodein.hits.services import HitsService
from .dto import TopDto
from ..utils.proxy import Proxy


class TopUtil:
    @staticmethod
    def serialize(rows: QuerySet[Audio]) -> List[TopDto]:
        dtos: List[TopDto] = []

        for row in rows:
            image = Proxy.screen_image(row)
            hits = HitsService.count_all(row)

            dto = TopDto(
                slug=row.slug,
                title=row.title,
                hits=hits,
                type=row.type,
                image=image,
            )

            dtos.append(dto)

        return dtos
