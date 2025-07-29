from django.db import models

from screwmycodein.dtos.audio_v2_model import AudioV2


class HitV2(models.Model):
    audio = models.ForeignKey(AudioV2, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()


class HitV2Service:
    @staticmethod
    def count_all(audio: AudioV2) -> int:
        results = HitV2.objects.filter(audio=audio)
        return results.count()
