from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .utils import YoutubeUtil
from ..audio.dto import AudioDtoFullResponse
from ..audio.services import AudioService
from ..audio.utils import AudioUtil
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
