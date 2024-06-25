from typing import Tuple

from youtube_dl import YoutubeDL

Title = str
Audio = str
Image = str
Info = Tuple[Title, Audio, Image]


class YoutubeDlUtil:
    @staticmethod
    def extract_info(url: str, format_id: str) -> Info:
        options = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
        }

        with YoutubeDL(options) as ydl:
            info = ydl.extract_info(url=url, download=False)

            title = info.get("title")
            image = info.get("thumbnails")[-1].get("url")

            formats = info.get("formats", [])

            for f in formats:
                if f["format_id"] == format_id:
                    audio = f["url"]
                    break

        return title, audio, image
