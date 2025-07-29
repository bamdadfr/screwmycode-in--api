from ninja import Router
from screwmycodein.dtos.audio_v2_model import AudioV2
from screwmycodein.dtos.hit_v2 import HitV2Service
from screwmycodein.v2.auth import JWTBearer
from screwmycodein.v2.body import ListBody
from screwmycodein.v2.date import get_date_filter

router = Router()


# communicate with react client
@router.post("/", auth=JWTBearer())
def main(request, body: ListBody):
    if body.sort_by not in ["hits", "date"]:
        return {"error": "sort_by must be 'hits' or 'date'"}

    limit = body.limit
    queryset = AudioV2.objects.all()

    date_filter = get_date_filter(body.range)
    if date_filter:
        queryset = queryset.filter(updated_at__gte=date_filter)

    if body.sort_by == "date":
        audios = queryset.order_by("-updated_at")[:limit]
    else:  # hits
        audios = list(queryset[:1000])
        audios.sort(key=lambda x: HitV2Service.count_all(x), reverse=True)
        audios = audios[:limit]

    items = [
        {
            "url": audio.url,
            "title": audio.title,
            "hits": HitV2Service.count_all(audio),
        }
        for audio in audios
    ]

    return {
        "sort_by": body.sort_by,
        "range": body.range,
        "limit": body.limit,
        "length": len(items),
        "items": items,
    }
