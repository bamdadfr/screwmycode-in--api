from ninja import NinjaAPI

from .bandcamp.router import router as bandcamp_router
from .home.router import router as home_router
from .latest.router import router as latest_router
from .soundcloud.router import router as soundcloud_router
from .top.router import router as top_router
from .webhook.router import router as webhook_router
from .youtube.router import router as youtube_router

api = NinjaAPI()

api.add_router("/", home_router)

api.add_router("/webhook", webhook_router)

api.add_router("/top", top_router)
api.add_router("/latest", latest_router)
api.add_router("/last", latest_router)

api.add_router("/youtube", youtube_router)
api.add_router("/soundcloud", soundcloud_router)
api.add_router("/bandcamp", bandcamp_router)
