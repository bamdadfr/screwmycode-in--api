from screwmycodein.utils.proxy import Proxy
from .dto import AudioDto
from .models import Audio
from ..hits.services import HitsService


class AudioUtil:
    @staticmethod
    def serialize(audio: Audio) -> AudioDto:
        hits = HitsService.count_all(audio)

        return {
            "slug": audio.slug,
            "type": audio.type,
            "hits": hits,
            "title": audio.title,
            "image": Proxy.screen_image(audio),
            "audio": Proxy.screen_audio(audio),
        }
