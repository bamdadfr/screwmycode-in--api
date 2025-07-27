from typing import Literal, NamedTuple
from django.db import models
import requests

from screwmycodein.utils.youtube_dl_utils import YoutubeDlUtil


class AudioV2Dto(NamedTuple):
    url: str
    hits: int
    title: str
    image: str
    audio: str


class AudioV2(models.Model):
    objects = models.Manager()

    id = models.BigAutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    url = models.TextField(unique=True)
    title = models.TextField()
    image = models.TextField()
    audio = models.TextField()


AudioType = Literal["soundcloud", "youtube", "bandcamp"]
AudioFormat = dict[AudioType, str]

audio_format_by_type: AudioFormat = {
    "soundcloud": "http_mp3",
    "youtube": "140",
    "bandcamp": "mp3-128",
}


class AudioV2Service:
    @staticmethod
    def find_or_create(url: str, audio_type: AudioType):
        row = AudioV2.objects.filter(url=url).first()
        audio_format = audio_format_by_type[audio_type]

        if row:
            is_available = is_audio_available(row)
        else:
            is_available = False

        # all fresh
        if row and is_available:
            return row

        # refresh outdated audio
        if row and not is_available:
            info = YoutubeDlUtil.extract_info_new(url, audio_format)
            row.audio = info.audio
            row.save()
            return row

        # create new
        info = YoutubeDlUtil.extract_info_new(url, audio_format)

        new_row = AudioV2(
            url=url,
            title=info.title,
            audio=info.audio,
            image=info.image,
        )

        new_row.save()

        return new_row


def is_audio_available(row: AudioV2) -> bool:
    try:
        response = requests.head(row.audio)
        return response.status_code == 200
    except Exception:
        return False
