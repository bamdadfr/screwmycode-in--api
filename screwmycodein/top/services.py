from django.db.models import Count
from datetime import datetime

from screwmycodein.audio.models import Audio
from screwmycodein.utils.time import TimeUtil


class TopService:
    @staticmethod
    def all(limit: int):
        rows = Audio.objects.annotate(count=Count("hit")).order_by("-count")
        return rows[:limit]

    @staticmethod
    def filter(
        limit: int,
        time_from: datetime,
        time_to: datetime = TimeUtil.now(),
    ):
        audios = (
            Audio.objects.annotate(count=Count("hit"))
            .filter(
                hit__timestamp__gte=time_from,
                hit__timestamp__lt=time_to,
            )
            .order_by("-count")
        )

        return audios[:limit]
