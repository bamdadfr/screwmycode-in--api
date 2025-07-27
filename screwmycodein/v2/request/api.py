from ninja import Router

from screwmycodein.dtos.audio_v2 import AudioV2Service
from screwmycodein.dtos.hit_v2 import HitV2, HitV2Service
from screwmycodein.v2.auth import JWTBearer
from screwmycodein.v2.body import ProcessBody
from screwmycodein.v2.responses import not_found_response

router = Router()


@router.post("/", auth=JWTBearer())
def main(request, data: ProcessBody):
    is_youtube = "youtube.com" in data.url
    is_soundcloud = "soundcloud.com" in data.url
    is_bandcamp = "bandcamp.com" in data.url

    if not is_youtube and not is_soundcloud and not is_bandcamp:
        return not_found_response

    if is_youtube:
        audio = AudioV2Service.find_or_create(data.url, "youtube")
        hit = HitV2(audio=audio)
        hit.save()
        count = HitV2Service.count_all(audio)

        return {
            "url": audio.url,
            "hits": count,
            "title": audio.title,
            "audio": audio.audio,
            # proxy image
        }

    if is_soundcloud:
        audio = AudioV2Service.find_or_create(data.url, "soundcloud")
        hit = HitV2(audio=audio)
        hit.save()
        count = HitV2Service.count_all(audio)

        return {
            "url": audio.url,
            "hits": count,
            "title": audio.title,
            # audio proxy
            # image proxy
        }

    if is_bandcamp:
        audio = AudioV2Service.find_or_create(data.url, "bandcamp")
        hit = HitV2(audio=audio)
        hit.save()
        count = HitV2Service.count_all(audio)

        return {
            "url": audio.url,
            "hits": count,
            "title": audio.title,
            "audio": audio.audio,
            # image proxy
        }
