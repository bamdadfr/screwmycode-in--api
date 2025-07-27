from ninja.security import HttpBearer
import jwt
from django.conf import settings


class JWTBearer(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
            return payload
        except jwt.InvalidTokenError:
            return None
