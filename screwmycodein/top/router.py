from typing import List

from django.core.handlers.wsgi import WSGIRequest
from ninja import Router

from .dto import TopDto
from .services import TopService
from .utils import TopUtil
from ..utils.route import RouteUtil
from ..utils.time import TimeUtil

router = Router()


@router.get("/", response=List[TopDto])
@RouteUtil.count_param
def top(request: WSGIRequest, count: int):
    rows = TopService.all(count)
    return TopUtil.serialize(rows)


@router.get("/month", response=List[TopDto])
@RouteUtil.count_param
def top_month(request: WSGIRequest, count: int):
    time_from = TimeUtil.days_ago(30)
    rows = TopService.filter(count, time_from)
    return TopUtil.serialize(rows)


@router.get("/week", response=List[TopDto])
@RouteUtil.count_param
def top_week(request: WSGIRequest, count: int):
    time_from = TimeUtil.days_ago(7)
    rows = TopService.filter(count, time_from)
    return TopUtil.serialize(rows)


@router.get("/yesterday", response=List[TopDto])
@RouteUtil.count_param
def top_yesterday(request: WSGIRequest, count: int):
    time_from = TimeUtil.hours_ago(48)
    time_to = TimeUtil.hours_ago(24)
    rows = TopService.filter(count, time_from, time_to)
    return TopUtil.serialize(rows)


@router.get("/today", response=List[TopDto])
@RouteUtil.count_param
def top_today(request: WSGIRequest, count: int):
    time_from = TimeUtil.hours_ago(24)
    rows = TopService.filter(count, time_from)
    return TopUtil.serialize(rows)


@router.get("/hour", response=List[TopDto])
@RouteUtil.count_param
def top_hour(request: WSGIRequest, count: int):
    time_from = TimeUtil.hours_ago(1)
    rows = TopService.filter(count, time_from)
    return TopUtil.serialize(rows)
