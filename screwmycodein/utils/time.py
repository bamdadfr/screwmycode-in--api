from datetime import timedelta

from django.utils import timezone


class TimeUtil:
    @staticmethod
    def now():
        return timezone.now()

    @staticmethod
    def hours_in(hours: int):
        return timezone.now() + timedelta(hours=hours)

    @staticmethod
    def hours_ago(hours: int):
        return timezone.now() - timedelta(hours=hours)

    @staticmethod
    def days_in(days: int):
        return timezone.now() + timedelta(days=days)

    @staticmethod
    def days_ago(days: int):
        return timezone.now() - timedelta(days=days)
