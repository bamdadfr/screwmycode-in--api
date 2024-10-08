from django.db.models import Count

from .models import Audio


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
    def find_top(limit: int):
        rows = Audio.objects.annotate(hit_count=Count('hit')).order_by('-hit_count')
        return rows[:limit]
