from typing_extensions import TypedDict


class SoundcloudDto(TypedDict):
    id: str
    hits: int
    title: str
    image: str
    audio: str
