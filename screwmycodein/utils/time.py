from datetime import timedelta, datetime


class TimeUtil:
    @staticmethod
    def now():
        return datetime.now()

    @staticmethod
    def hours_in(hours: int):
        return datetime.now() + timedelta(hours=hours)

    @staticmethod
    def hours_ago(hours: int):
        return datetime.now() - timedelta(hours=hours)

    @staticmethod
    def days_in(days: int):
        return datetime.now() + timedelta(days=days)

    @staticmethod
    def days_ago(days: int):
        return datetime.now() - timedelta(days=days)
