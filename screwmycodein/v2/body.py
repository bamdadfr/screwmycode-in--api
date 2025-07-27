from typing import Literal
from ninja import Schema


class ProcessBody(Schema):
    url: str


class StreamBody(Schema):
    url: str
    type: Literal["audio", "image"]


Range = Literal["today", "yesterday", "week", "month", "year", "all"]


class ListBody(Schema):
    sort_by: Literal["hits", "date"]
    range: Range = "all"
    limit: int = 10
