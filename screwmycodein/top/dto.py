from typing_extensions import TypedDict


class TopDto(TypedDict):
    slug: str
    title: str
    hits: int
    type: str
    image: str
