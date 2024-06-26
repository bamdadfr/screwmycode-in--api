from .models import Soundcloud


class SoundcloudService:
    @staticmethod
    def find_id(id_: str):
        results = Soundcloud.objects.filter(id=id_)
        return results.first()

    @staticmethod
    def find_latest(limit: int):
        results = Soundcloud.objects.order_by("-updated_at")
        return results[:limit]

    @staticmethod
    def find_top(limit: int):
        results = Soundcloud.objects.order_by("-hits")
        return results[:limit]
