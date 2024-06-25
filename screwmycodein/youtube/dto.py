from typing_extensions import TypedDict


class YoutubeDto(TypedDict):
    id: str
    hits: int
    title: str
    image: str
    audio: str
