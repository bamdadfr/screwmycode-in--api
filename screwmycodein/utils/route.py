from typing import Callable

from django.core.handlers.wsgi import WSGIRequest

COUNT = 10
COUNT_MIN = 1
COUNT_MAX = 50


class RouteUtil:
    @staticmethod
    def count_param(cb: Callable):
        def wrapper(request: WSGIRequest, count: int = COUNT, *args, **kwargs):
            count = COUNT_MIN if count < COUNT_MIN else count
            count = COUNT_MAX if count > COUNT_MAX else count

            return cb(request, count, *args, **kwargs)

        return wrapper
