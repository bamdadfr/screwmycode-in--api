from .models import Bandcamp


class BandcampService:
    @staticmethod
    def find_id(id_: str) -> Bandcamp | None:
        results = Bandcamp.objects.filter(id=id_)
        return results.first()

    @staticmethod
    def find_latest(limit: int):
        results = Bandcamp.objects.order_by("-updated_at")
        return results[:limit]

    @staticmethod
    def find_top(limit: int):
        results = Bandcamp.objects.order_by("-hits")
        return results[:limit]
