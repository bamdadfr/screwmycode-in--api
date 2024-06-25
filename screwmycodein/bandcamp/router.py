from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import BandcampDto
from .models import Bandcamp
from .services import BandcampService
from .utils import BandcampUtil
from ..utils.is_not_already_streaming import is_not_already_streaming
from ..utils.proxy import Proxy

router = Router()


@router.get("/")
def root(request: WSGIRequest):
    pass


@router.get("{artist}/{name}", response={200: BandcampDto, 404: str})
def index(request: WSGIRequest, artist: str, name: str):
    bandcamp_id = BandcampUtil.get_id(artist, name)
    results = BandcampService.find_id(bandcamp_id)

    if not results.exists():
        title, audio, image = BandcampUtil.get_info(bandcamp_id)

        bandcamp = Bandcamp(
            id=bandcamp_id,
            hits=0,
            title=title,
            audio=audio,
            image=image,
        )

        bandcamp.save()
    else:
        bandcamp: Bandcamp = results[0]

    return BandcampUtil.serialize(bandcamp)


@router.get("{artist}/{name}/audio", response={200: bytes, 404: str})
def get_audio(request: WSGIRequest, artist: str, name: str):
    bandcamp_id = BandcampUtil.get_id(artist, name)
    results = BandcampService.find_id(bandcamp_id)

    if not results.exists():
        return 404, "Not found"

    bandcamp: Bandcamp = results[0]
    is_available = Proxy.check_remote_available(bandcamp.audio)

    if not is_available:
        _, audio, _ = BandcampUtil.get_info(bandcamp.id)
        bandcamp.audio = audio

    if is_not_already_streaming(request):
        bandcamp.hits += 1

    bandcamp.save()

    return Proxy.stream_remote(bandcamp.audio)


@router.get("{artist}/{name}/image", response={200: bytes, 404: str})
def get_image(request: WSGIRequest, artist: str, name: str):
    bandcamp_id = BandcampUtil.get_id(artist, name)
    results = BandcampService.find_id(bandcamp_id)

    if not results.exists():
        return 404, "Not Found"

    bandcamp: Bandcamp = results[0]
    return Proxy.stream_remote(bandcamp.image)


@router.post("{artist}/{name}/increment", response={200: BandcampDto, 404: str})
def get_image(request: WSGIRequest, artist: str, name: str):
    bandcamp_id = BandcampUtil.get_id(artist, name)
    results = BandcampService.find_id(bandcamp_id)

    if not results.exists():
        return 404, "Not found"

    bandcamp: Bandcamp = results[0]
    bandcamp.hits += 1
    bandcamp.save()
    return BandcampUtil.serialize(bandcamp)
