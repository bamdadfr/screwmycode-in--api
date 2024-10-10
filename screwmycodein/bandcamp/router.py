from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from ..audio.dto import AudioDtoFullResponse
from ..audio.services import AudioService
from ..audio.utils import AudioUtil
from ..utils.youtube_dl_utils import YoutubeDlUtil

router = Router()


@router.get("/")
def root(request: WSGIRequest):
    """not used for now"""
    pass


@router.get("{artist}/{name}", response=AudioDtoFullResponse)
@YoutubeDlUtil.catch_exceptions
def bandcamp_index(request: WSGIRequest, artist: str, name: str):
    row = AudioService.find_or_create_bandcamp(artist, name)
    return AudioUtil.serialize(row)
