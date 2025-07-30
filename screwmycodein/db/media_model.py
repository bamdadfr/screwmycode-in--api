from django.db import models


class MediaModel(models.Model):
    objects = models.Manager()

    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    url = models.TextField(unique=True)
    title = models.TextField()
    image = models.TextField()
    audio = models.TextField()
