from ninja import NinjaAPI

api = NinjaAPI()

api.add_router("/", "screwmycodein.home.api.router")
api.add_router("/webhook", "screwmycodein.webhook.api.router")

# v1 routes
# api.add_router("/top", "screwmycodein.top.api.router")
# api.add_router("/last", "screwmycodein.last.api.router")
# api.add_router("/youtube", "screwmycodein.youtube.api.router")
# api.add_router("/soundcloud", "screwmycodein.soundcloud.api.router")
# api.add_router("/bandcamp", "screwmycodein.bandcamp.api.router")

# v2 routes
api.add_router("/v2/media", "screwmycodein.v2.media.api.router")
api.add_router("/v2/list", "screwmycodein.v2.list.api.router")
