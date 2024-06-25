from django.core.handlers.wsgi import WSGIRequest


def is_not_already_streaming(request: WSGIRequest) -> bool:
    return request.headers.get("Range") is None
