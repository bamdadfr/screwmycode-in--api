from django.core.handlers.wsgi import WSGIRequest


def is_new_request(request: WSGIRequest) -> bool:
    return request.headers.get("Range") == "bytes=0-"
