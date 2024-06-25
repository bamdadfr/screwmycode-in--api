from django.db.models import QuerySet

from .models import Youtube


class YoutubeService:
    @staticmethod
    def find_id(id_: str) -> QuerySet:
        return Youtube.objects.filter(id=id_)

    @staticmethod
    def find_latest(limit: int) -> QuerySet:
        results = Youtube.objects.order_by("-updated_at")
        return results[:limit]

    @staticmethod
    def find_top(limit: int) -> QuerySet:
        results = Youtube.objects.order_by("-hits")
        return results[:limit]
