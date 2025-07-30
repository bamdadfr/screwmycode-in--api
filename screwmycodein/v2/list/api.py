from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from screwmycodein.db.hit_v2 import HitV2Service
from screwmycodein.db.media_model import MediaModel
from screwmycodein.v2.auth import JWTBearer
from screwmycodein.v2.date import DateRange, get_date_filter
from screwmycodein.v2.sign import encode_media

router = Router()


@router.post("/", auth=JWTBearer())
def main(request: WSGIRequest):
    limit = 100
    queryset = MediaModel.objects.all()

    date_filter = get_date_filter(DateRange.all)
    if date_filter:
        queryset = queryset.filter(updated_at__gte=date_filter)

    medias = queryset.order_by("-updated_at")[:limit]

    base_path = "/v2/media/"

    items = [
        {
            "url": media.url,
            "title": media.title,
            "hits": HitV2Service.count_all(media),
            "audio": f"{base_path}{encode_media(media, 'audio')}",
            "image": f"{base_path}{encode_media(media, 'image')}",
        }
        for media in medias
    ]

    return {
        "items": items,
    }
