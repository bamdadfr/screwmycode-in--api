from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import SoundcloudDto
from .models import Soundcloud
from .services import SoundcloudService
from .utils import SoundcloudUtil
from ..utils.is_not_already_streaming import is_not_already_streaming
from ..utils.proxy import Proxy

router = Router()


@router.get("/")
def root(request: WSGIRequest):
    pass


@router.get("{artist}/{name}", response={200: SoundcloudDto, 404: str})
@SoundcloudUtil.validate_id
def index(request: WSGIRequest, artist: str, name: str):
    soundcloud_id = SoundcloudUtil.get_id(artist, name)
    results = SoundcloudService.find_id(soundcloud_id)

    if not results.exists():
        title, audio, image = SoundcloudUtil.get_info(soundcloud_id)

        soundcloud = Soundcloud(
            id=soundcloud_id,
            hits=0,
            title=title,
            audio=audio,
            image=image,
        )

        soundcloud.save()
    else:
        soundcloud: Soundcloud = results[0]

    return SoundcloudUtil.serialize(soundcloud)


@router.get("{artist}/{name}/audio", response={200: bytes, 404: str})
@SoundcloudUtil.validate_id
def get_audio(request: WSGIRequest, artist: str, name: str):
    soundcloud_id = SoundcloudUtil.get_id(artist, name)
    results = SoundcloudService.find_id(soundcloud_id)

    if not results.exists():
        return 404, "Not found"

    soundcloud: Soundcloud = results[0]
    is_available = Proxy.check_remote_available(soundcloud.audio)

    if not is_available:
        _, audio, _ = SoundcloudUtil.get_info(soundcloud.id)
        soundcloud.audio = audio

    if is_not_already_streaming(request):
        soundcloud.hits += 1

    soundcloud.save()

    return Proxy.stream_remote(soundcloud.audio)


@router.get("{artist}/{name}/image", response={200: bytes, 404: str})
@SoundcloudUtil.validate_id
def get_image(
    request: WSGIRequest,
    artist: str,
    name: str,
):
    soundcloud_id = SoundcloudUtil.get_id(artist, name)
    results = SoundcloudService.find_id(soundcloud_id)

    if not results.exists():
        return 404, "Not found"

    soundcloud: Soundcloud = results[0]
    return Proxy.stream_remote(soundcloud.image)


@router.post("{artist}/{name}/increment", response={200: SoundcloudDto, 404: str})
@SoundcloudUtil.validate_id
def increment(request: WSGIRequest, artist: str, name: str):
    soundcloud_id = SoundcloudUtil.get_id(artist, name)
    results = SoundcloudService.find_id(soundcloud_id)

    if not results.exists():
        return 404, "Not found"

    soundcloud: Soundcloud = results[0]
    soundcloud.hits += 1
    soundcloud.save()
    return SoundcloudUtil.serialize(soundcloud)
