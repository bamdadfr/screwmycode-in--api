from django.urls import path

from screwmycodein.screwmycodein.api import api

urlpatterns = [
    path("", api.urls),
]
