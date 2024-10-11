from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from screwmycodein.screwmycodein.audio.dto import (
    AudioDtoFullResponse,
    AudioDtoStreamResponse,
)
from screwmycodein.screwmycodein.audio.services import AudioService
from screwmycodein.screwmycodein.audio.utils import AudioUtil
from screwmycodein.screwmycodein.hits.models import Hit
from .utils import SoundcloudUtil
from ..utils.is_not_already_streaming import is_not_already_streaming
from ..utils.proxy import Proxy
from ..utils.youtube_dl_utils import YoutubeDlUtil

router = Router()


@router.get("/")
def root(request: WSGIRequest):
    """not used for now"""
    pass


@router.api_operation(
    ["GET", "HEAD"],
    "{artist}/{name}",
    response=AudioDtoFullResponse,
)
@YoutubeDlUtil.catch_exceptions
@SoundcloudUtil.validate_id
def soundcloud_index(request: WSGIRequest, artist: str, name: str):
    row = AudioService.find_or_create_soundcloud(artist, name)
    return AudioUtil.serialize(row)


@router.api_operation(
    ["GET", "HEAD"],
    "{artist}/{name}/audio",
    response=AudioDtoStreamResponse,
)
@SoundcloudUtil.validate_id
def soundcloud_audio(request: WSGIRequest, artist: str, name: str):
    row = AudioService.find_or_create_soundcloud(artist, name)

    if is_not_already_streaming(request):
        hits = Hit(audio=row)
        hits.save()

    return Proxy.stream_remote(row.audio)


@router.api_operation(
    ["GET", "HEAD"],
    "{artist}/{name}/image",
    response=AudioDtoStreamResponse,
)
@SoundcloudUtil.validate_id
def soundcloud_image(
    request: WSGIRequest,
    artist: str,
    name: str,
):
    row = AudioService.find_or_create_soundcloud(artist, name)
    return Proxy.stream_remote(row.image)
