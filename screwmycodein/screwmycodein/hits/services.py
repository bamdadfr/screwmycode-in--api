from .models import Hit
from ..audio.models import Audio


class HitsService:
    @staticmethod
    def count_all(audio: Audio) -> int:
        results = Hit.objects.filter(audio=audio)
        return results.count()
