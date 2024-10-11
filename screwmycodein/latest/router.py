from typing import List

from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import LatestDto
from .services import LastService
from .utils import LastUtil
from ..utils.route import RouteUtil
from ..utils.time import TimeUtil

router = Router()


@router.get("/", response=List[LatestDto])
@RouteUtil.count_param
def last(request: WSGIRequest, count: int):
    rows = LastService.all(count)
    return LastUtil.serialize(rows)


@router.get("/hour", response=List[LatestDto])
@RouteUtil.count_param
def last_hour(request: WSGIRequest, count: int):
    time_from = TimeUtil.hours_ago(1)
    rows = LastService.filter(count, time_from)
    return LastUtil.serialize(rows)


@router.get("/day", response=List[LatestDto])
@RouteUtil.count_param
def last_day(request: WSGIRequest, count: int):
    time_from = TimeUtil.hours_ago(24)
    rows = LastService.filter(count, time_from)
    return LastUtil.serialize(rows)


@router.get("/week", response=List[LatestDto])
@RouteUtil.count_param
def last_week(request: WSGIRequest, count: int):
    time_from = TimeUtil.days_ago(7)
    rows = LastService.filter(count, time_from)
    return LastUtil.serialize(rows)


@router.get("/month", response=List[LatestDto])
@RouteUtil.count_param
def last_week(request: WSGIRequest, count: int):
    time_from = TimeUtil.days_ago(30)
    rows = LastService.filter(count, time_from)
    return LastUtil.serialize(rows)
