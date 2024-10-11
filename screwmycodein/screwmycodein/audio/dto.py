from typing_extensions import TypedDict


class AudioDto(TypedDict):
    slug: str
    type: str
    hits: int
    title: str
    image: str
    audio: str


AudioDtoFullResponse = {200: AudioDto, 404: str}
AudioDtoStreamResponse = {200: bytes, 404: str}
