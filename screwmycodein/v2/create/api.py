import jwt
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse
from ninja import Router, Schema
from ninja.throttling import AnonRateThrottle

from screwmycodein.db.hit_v2 import HitV2, HitV2Service
from screwmycodein.db.media_service import MediaService
from screwmycodein.v2.audio import get_audio_type
from screwmycodein.v2.constants import MEDIA_BASE_PATH
from screwmycodein.v2.sign import encode_media

router = Router()


class BodyDto(Schema):
    url: str


@router.post(
    "/",
    throttle=AnonRateThrottle("6/m"),
)
def serve(request: WSGIRequest, body: BodyDto):
    try:
        _ = get_audio_type(body.url)
        media = MediaService.find_or_create(body.url)
        hit = HitV2(media=media)
        hit.save()

        return {
            "url": media.url,
            "title": media.title,
            "hits": HitV2Service.count_all(media),
            "audio": f"{MEDIA_BASE_PATH}{encode_media(media, 'audio')}",
            "image": f"{MEDIA_BASE_PATH}{encode_media(media, 'image')}",
        }
    except jwt.InvalidTokenError:
        return HttpResponse("Invalid token", status=401)
    except Exception as e:
        print(e)
        return HttpResponse("Forbidden", status=403)
