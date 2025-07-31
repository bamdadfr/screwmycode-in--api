import jwt
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse
from ninja import Router

from screwmycodein.db.hit_v2 import HitV2
from screwmycodein.db.media_service import MediaService
from screwmycodein.utils.proxy import Proxy
from screwmycodein.utils.youtube_dl_utils import YoutubeDlUtil
from screwmycodein.v2.audio import check_is_remote_available
from screwmycodein.v2.requests import is_new_request
from screwmycodein.v2.sign import decode_media_url

router = Router()


@router.get("/{token}")
def serve(request: WSGIRequest, token: str):
    try:
        raw = decode_media_url(token)
        media_url = raw["url"]
        media_type = raw["type"]
        media = MediaService.find_or_create(media_url)

        if media_type == "audio":
            audio_available = check_is_remote_available(media.audio)

            # refresh if necessary
            if not audio_available:
                info = YoutubeDlUtil.extract_info_new(media.url)
                media.audio = info.audio
                media.save()

            # increment hits
            if is_new_request(request):
                hit = HitV2(media=media)
                hit.save()

            raw_url = media.audio
            cache_duration = 3600  # 1 hour for audio

        else:
            image_available = check_is_remote_available(media.image)

            # refresh if necessary
            if not image_available:
                info = YoutubeDlUtil.extract_info_new(media.url)
                media.image = info.image
                media.save()

            raw_url = media.image
            cache_duration = 86400  # 24 hours for images (artworks)

        return Proxy.stream_remote(
            url=raw_url,
            request=request,
            cache_duration=cache_duration,
        )
    except jwt.InvalidTokenError:
        return HttpResponse("Invalid token", status=401)
