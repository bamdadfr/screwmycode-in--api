from django.core.handlers.wsgi import WSGIRequest
import jwt
from django.conf import settings
from django.http import HttpResponse
from ninja import Router
from screwmycodein.dtos.audio_v2_service import AudioV2Service
from screwmycodein.dtos.hit_v2 import HitV2, HitV2Service
from screwmycodein.utils.proxy import Proxy
from screwmycodein.utils.youtube_dl_utils import YoutubeDlUtil
from screwmycodein.v2.audio import is_audio_available
from screwmycodein.v2.auth import JWTBearer
from ninja import Schema
from screwmycodein.v2.requests import is_not_already_streaming

router = Router()


class InputBody(Schema):
    mediaUrl: str


@router.post("/input", auth=JWTBearer())
def request(request: WSGIRequest, body: InputBody):
    try:
        media_url = body.mediaUrl

        row = AudioV2Service.find_or_create(media_url)
        hit = HitV2(audio=row)
        hit.save()

        return {
            "url": row.url,
            "title": row.title,
            "hits": HitV2Service.count_all(row),
        }
    except jwt.InvalidTokenError:
        return HttpResponse("Invalid token", status=401)


@router.get("/{token}")
def serve(request: WSGIRequest, token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        media_url = payload["mediaUrl"]
        media_type = payload["mediaType"]

        row = AudioV2Service.find_or_create(media_url)

        if media_type == "audio":
            if not is_audio_available(row):
                info = YoutubeDlUtil.extract_info_new(row.url)
                row.audio = info.audio
                row.save()

            if is_not_already_streaming(request):
                hit = HitV2(audio=row)
                hit.save()

        target_url = row.image if media_type == "image" else row.audio

        return Proxy.stream_remote(target_url, request)
    except jwt.InvalidTokenError:
        return HttpResponse("Invalid token", status=401)
