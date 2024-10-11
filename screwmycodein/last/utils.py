from typing import List

from django.db.models import QuerySet

from screwmycodein.last.dto import LatestDto
from screwmycodein.screwmycodein.audio.models import Audio
from screwmycodein.screwmycodein.hits.services import HitsService
from screwmycodein.utils.proxy import Proxy


class LastUtil:
    @staticmethod
    def serialize(rows: QuerySet[Audio]) -> List[LatestDto]:
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
