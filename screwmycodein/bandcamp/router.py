from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .utils import BandcampUtil
from ..audio.dto import AudioDto
from ..audio.models import Audio
from ..audio.services import AudioService
from ..audio.utils import AudioUtil
from ..constants import AUDIO_EXPIRES, IMAGE_EXPIRES
from ..hits.models import Hit
from ..utils.is_not_already_streaming import is_not_already_streaming
from ..utils.proxy import Proxy
from ..utils.youtube_dl_utils import YoutubeDlUtil

router = Router()


@router.get("/")
def root(request: WSGIRequest):
    """not used for now"""
    pass


@router.get("{artist}/{name}", response={200: AudioDto, 404: str})
@YoutubeDlUtil.catch_exceptions
def index(request: WSGIRequest, artist: str, name: str):
    slug = BandcampUtil.get_slug(artist, name)
    row = AudioService.find_bandcamp_slug(slug)

    if row is None:
        title, audio, image = BandcampUtil.get_info(slug)

        row = Audio(
            type=Audio.Type.BANDCAMP,
            slug=slug,
            title=title,
            audio=audio,
            image=image,
        )

        row.save()

        hit = Hit(audio=row)
        hit.save()

    return AudioUtil.serialize(row)


@router.get("{artist}/{name}/audio", response={200: bytes, 404: str})
def get_audio(request: WSGIRequest, artist: str, name: str):
    slug = BandcampUtil.get_slug(artist, name)
    row = AudioService.find_bandcamp_slug(slug)

    if row is None:
        return 404, "Not found"

    is_available = Proxy.check_remote_available(row.audio)

    if not is_available:
        _, audio, _ = BandcampUtil.get_info(row.slug)
        row.audio = audio

    if is_not_already_streaming(request):
        hit = Hit(audio=row)
        hit.save()

    row.save()

    return Proxy.stream_remote(row.audio, AUDIO_EXPIRES)


@router.get("{artist}/{name}/image", response={200: bytes, 404: str})
def get_image(request: WSGIRequest, artist: str, name: str):
    slug = BandcampUtil.get_slug(artist, name)
    row = AudioService.find_bandcamp_slug(slug)

    if row is None:
        return 404, "Not Found"

    return Proxy.stream_remote(row.image, IMAGE_EXPIRES)


@router.post("{artist}/{name}/increment", response={200: AudioDto, 404: str})
def increment(request: WSGIRequest, artist: str, name: str):
    slug = BandcampUtil.get_slug(artist, name)
    row = AudioService.find_bandcamp_slug(slug)

    if row is None:
        return 404, "Not found"

    row.save()

    hit = Hit(audio=row)
    hit.save()

    return AudioUtil.serialize(row)
