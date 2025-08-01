from typing import Literal, Iterator
import requests
from django.core.handlers.wsgi import WSGIRequest
from django.http import StreamingHttpResponse
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import threading
import queue

from screwmycodein.screwmycodein.config import Config

EndpointType = Literal["audio", "image"]
config = Config()


def is_youtube_audio_source(url: str):
    if "googlevideo.com" in url or "youtube.com" in url:
        return True
    return False


def get_chunk_size(url: str, request: WSGIRequest | None = None) -> int:
    if is_youtube_audio_source(url):
        base_size = 1024 * 64  # 64KB - smaller for better responsiveness

        # slow connection?
        if request and request.META.get("HTTP_SAVE_DATA") == "on":
            return 1024 * 32  # 32 KB

        return base_size

    # non youtube services
    return 1024 * 256  # 256KB for others


class OptimizedProxy:
    # Thread-safe session pool
    _sessions = {}
    _session_lock = threading.Lock()

    @classmethod
    def get_session(cls, is_youtube: bool = False) -> requests.Session:
        """Get or create an optimized session"""
        key = "youtube" if is_youtube else "default"

        with cls._session_lock:
            if key not in cls._sessions:
                session = requests.Session()

                # Retry strategy
                retry_strategy = Retry(
                    total=3,
                    backoff_factor=0.3,
                    status_forcelist=[429, 500, 502, 503, 504],
                )

                if is_youtube:
                    # YouTube-optimized adapter
                    adapter = HTTPAdapter(
                        pool_connections=20,
                        pool_maxsize=20,
                        max_retries=retry_strategy,
                        pool_block=False,  # Don't block when pool is full
                    )
                else:
                    # General adapter
                    adapter = HTTPAdapter(
                        pool_connections=10,
                        pool_maxsize=10,
                        max_retries=retry_strategy,
                    )

                session.mount("http://", adapter)
                session.mount("https://", adapter)

                # Headers
                session.headers.update(
                    {
                        "User-Agent": "Mozilla/5.0 (compatible; AudioProxy/1.0)",
                        "Accept-Encoding": "gzip, deflate",  # Enable compression
                        "Connection": "keep-alive",
                    }
                )

                cls._sessions[key] = session

            return cls._sessions[key]

    @staticmethod
    def prefetch_generator(
        response: requests.Response, chunk_size: int, prefetch_size: int = 3
    ) -> Iterator[bytes]:
        """Generator with prefetching for smoother playback"""
        buffer = queue.Queue(maxsize=prefetch_size)

        def producer():
            try:
                for chunk in response.iter_content(chunk_size=chunk_size):
                    if chunk:
                        buffer.put(chunk)
                buffer.put(None)  # Signal end
            except Exception as e:
                buffer.put(e)  # Signal error

        # Start producer thread
        producer_thread = threading.Thread(target=producer, daemon=True)
        producer_thread.start()

        # Consumer
        while True:
            try:
                item = buffer.get(timeout=30)  # 30s timeout
                if item is None:
                    break
                if isinstance(item, Exception):
                    raise item
                yield item
            except queue.Empty:
                # Timeout - connection might be stalled
                break

    @staticmethod
    def stream_remote(
        url: str,
        request: WSGIRequest | None = None,
        cache_duration: int | None = None,
    ) -> StreamingHttpResponse:
        is_youtube = is_youtube_audio_source(url)
        session = OptimizedProxy.get_session(is_youtube)
        chunk_size = get_chunk_size(url, request)

        # Prepare headers
        headers = {}

        # Handle range requests for seeking
        if request:
            range_header = request.META.get("HTTP_RANGE")
            if range_header:
                headers["Range"] = range_header

        try:
            # Stream with timeout
            response = session.get(
                url,
                stream=True,
                headers=headers,
                timeout=(5, 30),  # (connect, read) timeouts
            )
            response.raise_for_status()

            # Use prefetching for YouTube
            if is_youtube:
                content_iterator = OptimizedProxy.prefetch_generator(
                    response, chunk_size, prefetch_size=5
                )
            else:
                # Simple streaming for other sources
                def simple_generator():
                    try:
                        for chunk in response.iter_content(chunk_size=chunk_size):
                            if chunk:
                                yield chunk
                    finally:
                        response.close()

                content_iterator = simple_generator()

            streaming = StreamingHttpResponse(
                content_iterator,
                content_type=response.headers.get("Content-Type", "audio/mpeg"),
                status=response.status_code,
            )

            # Copy important headers
            headers_to_copy = [
                "Accept-Ranges",
                "Content-Length",
                "Content-Range",
                "Content-Encoding",
                "Date",
                "ETag",
                "Last-Modified",
                "Cache-Control",
                "Expires",
            ]

            for header in headers_to_copy:
                if header in response.headers:
                    streaming[header] = response.headers[header]

            # Optimize caching
            if cache_duration:
                streaming["Cache-Control"] = (
                    f"public, max-age={cache_duration}, immutable"
                )
                streaming["Vary"] = "Accept-Encoding"
            else:
                streaming["Cache-Control"] = "no-cache, no-store, must-revalidate"
                streaming["Pragma"] = "no-cache"

            # CORS
            if request:
                origin = request.headers.get("Origin")
                if origin and origin in config.allowed_origins:
                    streaming["Access-Control-Allow-Origin"] = origin
                    streaming["Access-Control-Allow-Credentials"] = "true"
                    streaming["Access-Control-Allow-Methods"] = "GET, OPTIONS"
                    streaming["Access-Control-Allow-Headers"] = "Range"
                    streaming["Access-Control-Expose-Headers"] = (
                        "Content-Length, Content-Range, Accept-Ranges"
                    )

            return streaming

        except requests.RequestException:
            return StreamingHttpResponse(
                iter([b""]),
                status=502,
                content_type="text/plain",
            )


# Lightweight connection check
def check_is_remote_available(url: str) -> bool:
    """Fast availability check with HEAD request"""
    if not url:
        return False

    try:
        session = OptimizedProxy.get_session(is_youtube_audio_source(url))
        response = session.head(url, timeout=5, allow_redirects=True)
        return response.status_code == 200
    except Exception:
        return False


# Clean up sessions on app shutdown (call in your cleanup code)
def cleanup_sessions():
    with OptimizedProxy._session_lock:
        for session in OptimizedProxy._sessions.values():
            session.close()
        OptimizedProxy._sessions.clear()
