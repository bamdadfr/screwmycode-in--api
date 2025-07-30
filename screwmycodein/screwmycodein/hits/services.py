from ..audio.models import Audio
from .models import Hit


class HitsService:
    @staticmethod
    def count_all(audio: Audio) -> int:
        results = Hit.objects.filter(audio=audio)
        return results.count()
