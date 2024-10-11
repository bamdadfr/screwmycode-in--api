from datetime import datetime

from django.db.models import Count

from screwmycodein.screwmycodein.audio.models import Audio
from screwmycodein.utils.time import TimeUtil


class LastService:
    @staticmethod
    def all(limit: int):
        rows = Audio.objects.order_by("-updated_at")
        return rows[:limit]

    @staticmethod
    def filter(
        limit: int,
        time_from: datetime,
        time_to: datetime = TimeUtil.now(),
    ):
        rows = (
            Audio.objects.annotate(count=Count("hit"))
            .filter(
                hit__timestamp__gte=time_from,
                hit__timestamp__lt=time_to,
            )
            .order_by("-updated_at")
        )

        return rows[:limit]
