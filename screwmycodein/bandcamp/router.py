from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import BandcampDto
from .models import Bandcamp
from .services import BandcampService
from .utils import BandcampUtil
from ..constants import AUDIO_EXPIRES, IMAGE_EXPIRES
from ..utils.is_not_already_streaming import is_not_already_streaming
from ..utils.proxy import Proxy
from ..utils.youtube_dl_utils import YoutubeDlUtil

router = Router()


@router.get("/")
def root(request: WSGIRequest):
    """not used for now"""
    pass


@router.get("{artist}/{name}", response={200: BandcampDto, 404: str})
@YoutubeDlUtil.catch_exceptions
def index(request: WSGIRequest, artist: str, name: str):
    bandcamp_id = BandcampUtil.get_id(artist, name)
    bandcamp = BandcampService.find_id(bandcamp_id)

    if bandcamp is None:
        title, audio, image = BandcampUtil.get_info(bandcamp_id)

        bandcamp = Bandcamp(
            id=bandcamp_id,
            hits=0,
            title=title,
            audio=audio,
            image=image,
        )

        bandcamp.save()

    return BandcampUtil.serialize(bandcamp)


@router.get("{artist}/{name}/audio", response={200: bytes, 404: str})
def get_audio(request: WSGIRequest, artist: str, name: str):
    bandcamp_id = BandcampUtil.get_id(artist, name)
    bandcamp = BandcampService.find_id(bandcamp_id)

    if bandcamp is None:
        return 404, "Not found"

    is_available = Proxy.check_remote_available(bandcamp.audio)

    if not is_available:
        _, audio, _ = BandcampUtil.get_info(bandcamp.id)
        bandcamp.audio = audio

    if is_not_already_streaming(request):
        bandcamp.hits += 1

    bandcamp.save()

    return Proxy.stream_remote(bandcamp.audio, AUDIO_EXPIRES)


@router.get("{artist}/{name}/image", response={200: bytes, 404: str})
def get_image(request: WSGIRequest, artist: str, name: str):
    bandcamp_id = BandcampUtil.get_id(artist, name)
    bandcamp = BandcampService.find_id(bandcamp_id)

    if bandcamp is None:
        return 404, "Not Found"

    return Proxy.stream_remote(bandcamp.image, IMAGE_EXPIRES)


@router.post("{artist}/{name}/increment", response={200: BandcampDto, 404: str})
def increment(request: WSGIRequest, artist: str, name: str):
    bandcamp_id = BandcampUtil.get_id(artist, name)
    bandcamp = BandcampService.find_id(bandcamp_id)

    if bandcamp is None:
        return 404, "Not found"

    bandcamp.hits += 1
    bandcamp.save()
    return BandcampUtil.serialize(bandcamp)
