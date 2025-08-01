import base64
import hashlib
import hmac
import json
import time
from urllib.parse import quote

import jwt
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse, HttpResponseRedirect
from ninja import Router

from screwmycodein.db.hit_v2 import HitV2
from screwmycodein.db.media_service import MediaService
from screwmycodein.screwmycodein.config import Config
from screwmycodein.utils.youtube_dl_utils import YoutubeDlUtil
from screwmycodein.v2.audio import check_is_remote_available

# from screwmycodein.v2.date import hours_to_seconds
from screwmycodein.v2.requests import is_new_request
from screwmycodein.v2.sign import decode_media_url

router = Router()
config = Config()


def generate_php_url(
    media_url: str,
    media_type: str,
) -> str:
    payload = {
        "media_url": quote(media_url),
        "media_type": media_type,
        "expires": int(time.time()) + 300,  # 5 minutes from now
    }

    # Encode the payload
    payload_json = json.dumps(payload, separators=(",", ":"))
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode()).decode()

    # Sign the payload (not just timestamp)
    signature = hmac.new(
        config.proxy_secret.encode(),
        payload_b64.encode(),
        hashlib.sha256,
    ).hexdigest()

    php_url = f"{config.proxy_url}/stream.php?data={payload_b64}&sig={signature}"

    return php_url


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
            # cache_duration = hours_to_seconds(12)

        else:
            image_available = check_is_remote_available(media.image)

            # refresh if necessary
            if not image_available:
                info = YoutubeDlUtil.extract_info_new(media.url)
                media.image = info.image
                media.save()

            raw_url = media.image
            # cache_duration = hours_to_seconds(24)

        # php_url = (
        #     f"https://api.screwmycode.in"
        #     f"/stream.php?url={quote(raw_url)}"
        #     f"&type={media_type}"
        #     f"&cache={cache_duration}"
        # )

        php_url = generate_php_url(raw_url, media_type)
        return HttpResponseRedirect(php_url)

    except jwt.InvalidTokenError:
        return HttpResponse("Invalid token", status=401)
