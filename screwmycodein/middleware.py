from datetime import datetime, timedelta
from typing import Callable

from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponseNotFound, HttpRequest, HttpResponse

GetResponse = Callable[[HttpRequest], HttpResponse]


def __base_middleware(get_response, endpoint: str, hours: int):
    def middleware(request: WSGIRequest):
        response = get_response(request)

        if not request.path.endswith(endpoint):
            return response

        expires_date = datetime.now() + timedelta(hours=hours)
        expires_header = expires_date.strftime("%a, %d %b %Y %H:%M:%S GMT")
        response["Expires"] = expires_header
        return response

    return middleware


def audio_middleware(get_response):
    return __base_middleware(get_response, "/audio", 6)


def image_middleware(get_response):
    return __base_middleware(get_response, "/image", 48)


def success_middleware(get_response: GetResponse):
    def middleware(request: WSGIRequest):
        response = get_response(request)

        if response.status_code != 200:
            return HttpResponseNotFound("Error")

        return response

    return middleware
