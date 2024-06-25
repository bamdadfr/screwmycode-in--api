from django.db import models


class BaseModel(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    hits = models.IntegerField()
    title = models.TextField()
    image = models.TextField()
    audio = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = models.Manager()

    class Meta:
        abstract = True
