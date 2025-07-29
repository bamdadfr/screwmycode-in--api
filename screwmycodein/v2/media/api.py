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
from screwmycodein.v2.body import StreamBody
from screwmycodein.v2.requests import is_not_already_streaming
from screwmycodein.v2.responses import not_found_response

router = Router()


# communicating with nextjs api route
@router.post("/get", auth=JWTBearer())
def get(request, data: StreamBody):
    try:
        row = AudioV2Service.find_or_create(data.url)

        if data.type == "audio":
            if not is_audio_available(row):
                info = YoutubeDlUtil.extract_info_new(row.url)
                row.audio = info.audio
                row.save()

            if is_not_already_streaming(request):
                hit = HitV2(audio=row)
                hit.save()

        return {
            "media_url": row.image if data.type == "image" else row.audio,
            "media_type": data.type,
            "item": {
                "url": row.url,
                "title": row.title,
                "hits": HitV2Service.count_all(row),
            },
        }
    except Exception:
        return not_found_response


# communicating with react client
@router.get("/{token}")
def serve(request: WSGIRequest, token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        media_url = payload["media_url"]

        return Proxy.stream_remote(media_url, request)

    except jwt.ExpiredSignatureError:
        return HttpResponse("Token expired", status=410)
    except jwt.InvalidTokenError:
        return HttpResponse("Invalid token", status=401)
    except Exception:
        return HttpResponse("Server error", status=500)
