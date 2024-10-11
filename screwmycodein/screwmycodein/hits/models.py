from django.db import models

from screwmycodein.screwmycodein.audio.models import Audio


class Hit(models.Model):
    audio = models.ForeignKey(Audio, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()
