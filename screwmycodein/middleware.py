from datetime import datetime, timedelta

from django.core.handlers.wsgi import WSGIRequest


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
