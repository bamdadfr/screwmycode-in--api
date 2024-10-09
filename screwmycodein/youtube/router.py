from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .utils import YoutubeUtil
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


@router.get("{youtube_id}", response={200: AudioDto, 404: str})
@YoutubeUtil.validate_id
@YoutubeDlUtil.catch_exceptions
def youtube(request: WSGIRequest, slug: str):
    row = AudioService.find_youtube_slug(slug)

    if row is None:
        title, audio, image = YoutubeUtil.get_info(slug)

        row = Audio(
            slug=slug,
            type=Audio.Type.YOUTUBE,
            title=title,
            audio=audio,
            image=image,
        )

        row.save()

        hits = Hit(audio=row)
        hits.save()

    return AudioUtil.serialize(row)


@router.get("{youtube_id}/audio", response={200: bytes, 404: str})
@YoutubeUtil.validate_id
def youtube_audio(request: WSGIRequest, slug: str):
    row = AudioService.find_youtube_slug(slug)

    if row is None:
        return 404, "Not Found"

    is_available = Proxy.check_remote_available(row.audio)

    if not is_available:
        _, audio, _ = YoutubeUtil.get_info(row.slug)
        row.audio = audio

    if is_not_already_streaming(request):
        hits = Hit(audio=row)
        hits.save()

    row.save()

    return Proxy.stream_remote(row.audio, AUDIO_EXPIRES, 512 * 1024)


@router.get("{youtube_id}/image", response={200: bytes, 404: str})
@YoutubeUtil.validate_id
def youtube_image(request: WSGIRequest, slug: str):
    row = AudioService.find_youtube_slug(slug)

    if row is None:
        return 404, "Not found"

    return Proxy.stream_remote(row.image, IMAGE_EXPIRES)


@router.post("{youtube_id}/increment", response={200: AudioDto, 404: str})
@YoutubeUtil.validate_id
def youtube_increment(request: WSGIRequest, slug: str):
    row = AudioService.find_youtube_slug(slug)

    if row is None:
        return 404, "Not found"

    row.save()

    hits = Hit(audio=row)
    hits.save()

    return AudioUtil.serialize(row)
