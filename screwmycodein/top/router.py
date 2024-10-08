from typing import List

from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import TopDto
from .utils import TopUtil
from ..audio.services import AudioService
from ..utils.time import TimeUtil

router = Router()

LIMIT = 10
LIMIT_MAX = 50


# TODO: use decorator instead
def sanitize_limit(limit: int):
    if limit <= 0:
        return 0

    if limit >= LIMIT_MAX:
        return LIMIT_MAX

    return limit


@router.get("/", response=List[TopDto])
def index(request: WSGIRequest, limit: int = LIMIT):
    rows = AudioService.find_top_all(sanitize_limit(limit))
    return TopUtil.serialize(rows)


@router.get("/week", response=List[TopDto])
def index(request: WSGIRequest, limit: int = LIMIT):
    time_from = TimeUtil.days_ago(7)
    rows = AudioService.find_top_filter(sanitize_limit(limit), time_from)
    return TopUtil.serialize(rows)


@router.get("/yesterday", response=List[TopDto])
def index(request: WSGIRequest, limit: int = LIMIT):
    time_from = TimeUtil.hours_ago(48)
    time_to = TimeUtil.hours_ago(24)
    rows = AudioService.find_top_filter(sanitize_limit(limit), time_from, time_to)
    return TopUtil.serialize(rows)


@router.get("/today", response=List[TopDto])
def index(request: WSGIRequest, limit: int = LIMIT):
    time_from = TimeUtil.hours_ago(24)
    rows = AudioService.find_top_filter(sanitize_limit(limit), time_from)
    return TopUtil.serialize(rows)


@router.get("/hour", response=List[TopDto])
def index(request: WSGIRequest, limit: int = LIMIT):
    time_from = TimeUtil.hours_ago(1)
    rows = AudioService.find_top_filter(sanitize_limit(limit), time_from)
    return TopUtil.serialize(rows)
