from ninja.throttling import AnonRateThrottle


class CloudflareAwareThrottle(AnonRateThrottle):
    def get_ident(self, request):
        # Get the real client IP
        cf_connecting_ip = request.META.get("HTTP_CF_CONNECTING_IP")
        if cf_connecting_ip:
            return cf_connecting_ip

        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()

        # Fallback to the default implementation
        return super().get_ident(request)
