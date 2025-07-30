from django.core.handlers.wsgi import WSGIRequest


def is_new_request(request: WSGIRequest) -> bool:
    # works on local env
    # return request.headers.get("Range") == "bytes=0-"

    # works on prod?
    return request.headers.get("Range") is None
