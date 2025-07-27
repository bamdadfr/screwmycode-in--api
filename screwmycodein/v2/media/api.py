import jwt
from django.conf import settings
from django.http import HttpResponse
from ninja import Router
from screwmycodein.dtos.audio_v2 import AudioType, AudioV2Service
from screwmycodein.dtos.hit_v2 import HitV2, HitV2Service
from screwmycodein.utils.proxy import Proxy
from screwmycodein.v2.auth import JWTBearer
from screwmycodein.v2.body import StreamBody
from screwmycodein.v2.requests import is_not_already_streaming
from screwmycodein.v2.responses import not_found_response

router = Router()


@router.post("/", auth=JWTBearer())
def main(request, data: StreamBody):
    is_soundcloud = "soundcloud.com" in data.url
    is_youtube = "youtube.com" in data.url
    is_bandcamp = "bandcamp.com" in data.url

    if not is_youtube and not is_soundcloud and not is_bandcamp:
        return not_found_response

    if is_soundcloud:
        row = AudioV2Service.find_or_create(data.url, "soundcloud")

        if data.type == "audio":
            if is_not_already_streaming(request):
                hit = HitV2(audio=row)
                hit.save()

            return Proxy.stream_remote(row.audio)
        if data.type == "image":
            return Proxy.stream_remote(row.image)

        return None


@router.post("/get", auth=JWTBearer())
def get(request, data: StreamBody):
    is_youtube = "youtube.com" in data.url
    is_soundcloud = "soundcloud.com" in data.url
    is_bandcamp = "bandcamp.com" in data.url
    print(data, is_youtube, is_soundcloud, is_bandcamp)

    if not is_youtube and not is_soundcloud and not is_bandcamp:
        return not_found_response

    if is_youtube:
        audio_type = "youtube"
    elif is_soundcloud:
        audio_type = "soundcloud"
    elif is_bandcamp:
        audio_type = "bandcamp"
    else:
        raise ValueError()

    row = AudioV2Service.find_or_create(data.url, audio_type)

    if data.type == "audio" and is_not_already_streaming(request):
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


@router.get("/{token}")
def serve(request, token: str):
    """Serve media using temporary token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        media_url = payload["media_url"]

        return Proxy.stream_remote(media_url)

    except jwt.ExpiredSignatureError:
        return HttpResponse("Token expired", status=410)
    except jwt.InvalidTokenError:
        return HttpResponse("Invalid token", status=401)
    except Exception as e:
        return HttpResponse("Server error", status=500)
