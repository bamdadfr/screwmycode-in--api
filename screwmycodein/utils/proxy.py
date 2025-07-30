from typing import Literal

import requests
from django.core.handlers.wsgi import WSGIRequest
from django.http import StreamingHttpResponse

from screwmycodein.screwmycodein.config import Config

EndpointType = Literal["audio", "image"]
config = Config()


def is_youtube_audio_source(url: str):
    if "googlevideo.com" in url or "youtube.com" in url:
        return True

    return False


def get_chunk_size(
    url: str,
    request: WSGIRequest | None = None,
) -> int:
    """
    Determine optimal chunk size based on source and client hints
    """
    if is_youtube_audio_source(url):
        # YouTube audio typically works well with these sizes
        # Smaller = faster start, larger = better efficiency
        base_size = 1024 * 256  # 256KB default

        # Check if client has slow connection indicators
        if request and request.META.get("HTTP_SAVE_DATA") == "on":
            return 1024 * 128  # 128KB for slow connections

        return base_size

    # Non-YouTube sources can handle larger chunks
    return 1024 * 1024  # 1MB for others


class Proxy:
    @staticmethod
    def stream_remote(
        url: str,
        request: WSGIRequest | None = None,
    ) -> StreamingHttpResponse:
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; AudioProxy/1.0)",
        }

        if is_youtube_audio_source(url):
            session = requests.Session()
            # Add connection pooling for better performance
            adapter = requests.adapters.HTTPAdapter(
                pool_connections=10,
                pool_maxsize=10,
                max_retries=3,
            )
            session.mount("https://", adapter)
            response = session.get(url, stream=True, headers=headers)
        else:
            response = requests.get(url, stream=True, headers=headers)

        chunk_size = get_chunk_size(url, request)

        # Buffer iterator to reduce stuttering
        def generate():
            try:
                for chunk in response.iter_content(chunk_size=chunk_size):
                    if chunk:
                        yield chunk
            except requests.exceptions.ChunkedEncodingError:
                # Handle incomplete reads gracefully
                pass
            finally:
                response.close()

        streaming = StreamingHttpResponse(
            generate(),
            content_type=response.headers.get("Content-Type", "audio/mpeg"),
        )

        # Enhanced headers for better caching and buffering
        headers_to_copy = [
            "Accept-Ranges",
            "Content-Length",
            "X-Content-Type-Options",
            "Date",
            "Expires",
            "Cache-Control",
            "Age",
            "ETag",
            "Last-Modified",
        ]

        for header in headers_to_copy:
            if header in response.headers:
                streaming.headers[header] = response.headers[header]

        # Add buffering hints
        streaming["X-Accel-Buffering"] = "no"  # Disable nginx buffering
        streaming["Cache-Control"] = "no-cache, no-store, must-revalidate"

        # CORS handling
        if request:
            origin = request.headers.get("Origin")
            if origin and origin in config.allowed_origins:
                streaming["Access-Control-Allow-Origin"] = origin
                streaming["Access-Control-Allow-Credentials"] = "true"
                streaming["Access-Control-Allow-Methods"] = "GET, OPTIONS"
                streaming["Access-Control-Allow-Headers"] = (
                    "Authorization, Content-Type, Range"
                )
                streaming["Access-Control-Expose-Headers"] = (
                    "Content-Length, Content-Range, Accept-Ranges"
                )

        return streaming
