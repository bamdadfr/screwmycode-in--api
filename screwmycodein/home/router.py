from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from screwmycodein.version import VERSION
from .dto import HomeDto

router = Router()


@router.get("/", response=HomeDto)
def home_get(request: WSGIRequest):
    dto = HomeDto(version=VERSION)
    return dto
