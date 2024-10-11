import requests

from screwmycodein.bandcamp.utils import BandcampUtil
from screwmycodein.screwmycodein.exceptions import AudioTypeUnknownException
from screwmycodein.soundcloud.utils import SoundcloudUtil
from screwmycodein.youtube.utils import YoutubeUtil
from .models import Audio
from ..hits.models import Hit


class AudioService:
    @staticmethod
    def __find_or_create_audio(slug: str, audio_type: Audio.Type):
        if audio_type == Audio.Type.YOUTUBE:
            existing_row = AudioService.__find_youtube_slug(slug)
        elif audio_type == Audio.Type.SOUNDCLOUD:
            existing_row = AudioService.__find_soundcloud_slug(slug)
        elif audio_type == Audio.Type.BANDCAMP:
            existing_row = AudioService.__find_bandcamp_slug(slug)
        else:
            raise AudioTypeUnknownException

        if existing_row is not None:
            return AudioService.ensure_audio_available(existing_row)

        if audio_type == Audio.Type.YOUTUBE:
            title, audio, image = YoutubeUtil.get_info(slug)
        elif audio_type == Audio.Type.SOUNDCLOUD:
            title, audio, image = SoundcloudUtil.get_info(slug)
        elif audio_type == Audio.Type.BANDCAMP:
            title, audio, image = BandcampUtil.get_info(slug)
        else:
            raise AudioTypeUnknownException

        new_row = Audio(
            type=audio_type,
            slug=slug,
            title=title,
            audio=audio,
            image=image,
        )

        new_row.save()

        hit = Hit(audio=new_row)
        hit.save()

        return new_row

    @staticmethod
    def __find_youtube_slug(slug: str) -> Audio | None:
        rows = Audio.objects.filter(type=Audio.Type.YOUTUBE, slug=slug)
        return rows.first()

    @staticmethod
    def find_or_create_youtube(slug: str) -> Audio:
        return AudioService.__find_or_create_audio(slug, Audio.Type.YOUTUBE)

    @staticmethod
    def __find_soundcloud_slug(slug: str) -> Audio | None:
        rows = Audio.objects.filter(type=Audio.Type.SOUNDCLOUD, slug=slug)
        return rows.first()

    @staticmethod
    def find_or_create_soundcloud(artist: str, name: str) -> Audio:
        slug = SoundcloudUtil.get_slug(artist, name)
        return AudioService.__find_or_create_audio(slug, Audio.Type.SOUNDCLOUD)

    @staticmethod
    def __find_bandcamp_slug(slug: str) -> Audio | None:
        rows = Audio.objects.filter(type=Audio.Type.BANDCAMP, slug=slug)
        return rows.first()

    @staticmethod
    def find_or_create_bandcamp(artist: str, name: str) -> Audio:
        slug = BandcampUtil.get_slug(artist, name)
        return AudioService.__find_or_create_audio(slug, Audio.Type.BANDCAMP)

    @staticmethod
    def ensure_audio_available(row: Audio) -> Audio:
        response = requests.head(row.audio)

        if response.status_code == 200:
            return row

        if row.type == Audio.Type.YOUTUBE:
            _, audio, _ = YoutubeUtil.get_info(row.slug)
        elif row.type == Audio.Type.SOUNDCLOUD:
            _, audio, _ = SoundcloudUtil.get_info(row.slug)
        elif row.type == Audio.Type.BANDCAMP:
            _, audio, _ = BandcampUtil.get_info(row.slug)
        else:
            raise AudioTypeUnknownException

        row.audio = audio

        return row
