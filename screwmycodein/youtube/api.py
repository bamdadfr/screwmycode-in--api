from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from screwmycodein.screwmycodein.audio.dto import (
    AudioDtoFullResponse,
    AudioDtoStreamResponse,
)
from screwmycodein.screwmycodein.audio.services import AudioService
from screwmycodein.screwmycodein.audio.utils import AudioUtil
from .utils import YoutubeUtil
from ..utils.proxy import Proxy
from ..utils.youtube_dl_utils import YoutubeDlUtil

router = Router()


@router.get("/")
def root(request: WSGIRequest):
    """not used for now"""
    pass


@router.get("{youtube_id}", response=AudioDtoFullResponse)
@YoutubeUtil.validate_id
@YoutubeDlUtil.catch_exceptions
def youtube_index(request: WSGIRequest, slug: str):
    row = AudioService.find_or_create_youtube(slug)
    return AudioUtil.serialize(row)


@router.api_operation(
    ["GET", "HEAD"],
    "{youtube_id}/image",
    response=AudioDtoStreamResponse,
)
@YoutubeUtil.validate_id
def youtube_image(
    request: WSGIRequest,
    slug: str,
):
    row = AudioService.find_or_create_youtube(slug)
    return Proxy.stream_remote(row.image)
