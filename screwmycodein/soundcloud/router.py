from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .utils import SoundcloudUtil
from ..audio.dto import AudioDto
from ..audio.models import Audio
from ..audio.services import AudioService
from ..audio.utils import AudioUtil
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
@SoundcloudUtil.validate_id
def index(request: WSGIRequest, artist: str, name: str):
    slug = SoundcloudUtil.get_slug(artist, name)
    row = AudioService.find_soundcloud_slug(slug)

    if row is None:
        title, audio, image = SoundcloudUtil.get_info(slug)

        row = Audio(
            slug=slug,
            type=Audio.Type.SOUNDCLOUD,
            title=title,
            audio=audio,
            image=image,
        )

        row.save()

        hits = Hit(audio=row)
        hits.save()

    return AudioUtil.serialize(row)


@router.get("{artist}/{name}/audio", response={200: bytes, 404: str})
@SoundcloudUtil.validate_id
def get_audio(request: WSGIRequest, artist: str, name: str):
    slug = SoundcloudUtil.get_slug(artist, name)
    row = AudioService.find_soundcloud_slug(slug)

    if row is None:
        return 404, "Not found"

    is_available = Proxy.check_remote_available(row.audio)

    if not is_available:
        _, audio, _ = SoundcloudUtil.get_info(row.slug)
        row.audio = audio

    if is_not_already_streaming(request):
        hits = Hit(audio=row)
        hits.save()

    row.save()

    return Proxy.stream_remote(row.audio)


@router.get("{artist}/{name}/image", response={200: bytes, 404: str})
@SoundcloudUtil.validate_id
def get_image(
    request: WSGIRequest,
    artist: str,
    name: str,
):
    slug = SoundcloudUtil.get_slug(artist, name)
    row = AudioService.find_soundcloud_slug(slug)

    if row is None:
        return 404, "Not found"

    return Proxy.stream_remote(row.image)


@router.post("{artist}/{name}/increment", response={200: AudioDto, 404: str})
@SoundcloudUtil.validate_id
def increment(request: WSGIRequest, artist: str, name: str):
    slug = SoundcloudUtil.get_slug(artist, name)
    row = AudioService.find_soundcloud_slug(slug)

    if row is None:
        return 404, "Not found"

    hits = Hit(audio=row)
    hits.save()

    return AudioUtil.serialize(row)
