from typing_extensions import TypedDict


class AudioDto(TypedDict):
    slug: str
    type: str
    hits: int
    title: str
    image: str
    audio: str
