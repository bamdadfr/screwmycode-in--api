from typing_extensions import TypedDict


class BandcampDto(TypedDict):
    id: str
    hits: int
    title: str
    image: str
    audio: str
