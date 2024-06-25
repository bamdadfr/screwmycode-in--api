from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import YoutubeDto
from .models import Youtube
from .services import YoutubeService
from .utils import YoutubeUtil
from ..utils.is_not_already_streaming import is_not_already_streaming
from ..utils.proxy import Proxy

router = Router()


@router.get("/")
def root(request: WSGIRequest):
    pass


@router.get("{youtube_id}", response={200: YoutubeDto, 404: str})
@YoutubeUtil.validate_id
def index(request: WSGIRequest, youtube_id: str):
    results = YoutubeService.find_id(youtube_id)

    if not results.exists():
        title, audio, image = YoutubeUtil.get_info(youtube_id)

        youtube = Youtube(
            id=youtube_id,
            hits=0,
            title=title,
            audio=audio,
            image=image,
        )

        youtube.save()
    else:
        youtube: Youtube = results[0]

    return YoutubeUtil.serialize(youtube)


@router.get("{youtube_id}/audio", response={200: bytes, 404: str})
@YoutubeUtil.validate_id
def get_audio(
    request: WSGIRequest,
    youtube_id: str,
):
    results = YoutubeService.find_id(youtube_id)

    if not results.exists():
        return 404, "Not Found"

    youtube: Youtube = results[0]
    is_available = Proxy.check_remote_available(youtube.audio)

    if not is_available:
        _, audio, _ = YoutubeUtil.get_info(youtube.id)
        youtube.audio = audio

    if is_not_already_streaming(request):
        youtube.hits += 1

    youtube.save()

    return Proxy.stream_remote(youtube.audio, 256)


@router.get("{youtube_id}/image", response={200: bytes, 404: str})
@YoutubeUtil.validate_id
def get_image(request: WSGIRequest, youtube_id: str):
    results = YoutubeService.find_id(youtube_id)

    if not results.exists():
        return 404, "Not found"

    youtube: Youtube = results[0]
    return Proxy.stream_remote(youtube.image)


@router.post("{youtube_id}/increment", response={200: YoutubeDto, 404: str})
@YoutubeUtil.validate_id
def increment(request: WSGIRequest, youtube_id: str):
    results = YoutubeService.find_id(youtube_id)

    if not results.exists():
        return 404, "Not found"

    youtube: Youtube = results[0]
    youtube.hits += 1
    youtube.save()
    return YoutubeUtil.serialize(youtube)
