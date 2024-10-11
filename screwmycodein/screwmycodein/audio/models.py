from django.db import models


class Audio(models.Model):
    class Type(models.TextChoices):
        YOUTUBE = "youtube"
        SOUNDCLOUD = "soundcloud"
        BANDCAMP = "bandcamp"

    objects = models.Manager()

    id = models.BigAutoField(primary_key=True)
    type = models.CharField(
        max_length=100,
        choices=Type,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    slug = models.TextField()
    title = models.TextField()
    image = models.TextField()
    audio = models.TextField()
