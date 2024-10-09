from datetime import datetime

from django.db.models import Count

from .models import Audio
from ..utils.time import TimeUtil


class AudioService:
    @staticmethod
    def find_youtube_slug(slug: str) -> Audio | None:
        rows = Audio.objects.filter(type=Audio.Type.YOUTUBE, slug=slug)
        return rows.first()

    @staticmethod
    def find_soundcloud_slug(slug: str) -> Audio | None:
        rows = Audio.objects.filter(type=Audio.Type.SOUNDCLOUD, slug=slug)
        return rows.first()

    @staticmethod
    def find_bandcamp_slug(slug: str) -> Audio | None:
        rows = Audio.objects.filter(type=Audio.Type.BANDCAMP, slug=slug)
        return rows.first()

    @staticmethod
    def find_latest(limit: int):
        rows = Audio.objects.order_by("-updated_at")
        return rows[:limit]

    @staticmethod
    def find_top_all(limit: int):
        audios = Audio.objects.annotate(count=Count("hit")).order_by("-count")
        return audios[:limit]

    @staticmethod
    def find_top_filter(
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
