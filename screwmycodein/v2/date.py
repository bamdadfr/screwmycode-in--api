from datetime import timedelta
from django.utils import timezone


def get_date_filter(range_param: str):
    now = timezone.now()

    if range_param == "today":
        return now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif range_param == "yesterday":
        yesterday = now - timedelta(days=1)
        return yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
    elif range_param == "week":
        return now - timedelta(days=7)
    elif range_param == "month":
        return now - timedelta(days=30)
    elif range_param == "year":
        return now - timedelta(days=365)
    else:  # "all"
        return None
