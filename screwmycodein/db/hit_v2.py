from django.db import models

from screwmycodein.db.media_model import MediaModel


class HitV2(models.Model):
    media = models.ForeignKey(MediaModel, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()


class HitV2Service:
    @staticmethod
    def count_all(media: MediaModel) -> int:
        results = HitV2.objects.filter(media=media)
        return results.count()
