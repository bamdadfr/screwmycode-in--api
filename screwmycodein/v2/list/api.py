from ninja import Router
from datetime import timedelta
from django.utils import timezone
from screwmycodein.dtos.audio_v2 import AudioV2
from screwmycodein.dtos.hit_v2 import HitV2Service
from screwmycodein.v2.auth import JWTBearer
from screwmycodein.v2.body import ListBody

router = Router()


def get_date_filter(range_param: str):
    now = timezone.now()

    if range_param == "today":
        return now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif range_param == "yesterday":
        yesterday = now - timedelta(days=1)
        return yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
    elif range_param == "week":
        return now - timedelta(days=7)
    elif range_param == "month":
        return now - timedelta(days=30)
    elif range_param == "year":
        return now - timedelta(days=365)
    else:  # "all"
        return None


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
