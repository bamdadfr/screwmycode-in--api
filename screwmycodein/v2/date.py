from datetime import timedelta
from enum import Enum

from django.utils import timezone


class DateRange(Enum):
    today = "today"
    yesterday = "yesterday"
    week = "week"
    month = "month"
    year = "year"
    all = "all"


def get_date_filter(date_range: DateRange):
    now = timezone.now()

    if date_range is DateRange.today:
        return now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif date_range is DateRange.yesterday:
        yesterday = now - timedelta(days=1)
        return yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
    elif date_range is DateRange.week:
        return now - timedelta(days=7)
    elif date_range is DateRange.month:
        return now - timedelta(days=30)
    elif date_range is DateRange.year:
        return now - timedelta(days=365)
    else:
        # all
        return None


def hours_to_seconds(hours: int) -> int:
    return 60 * 60 * hours
