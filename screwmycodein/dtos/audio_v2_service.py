from screwmycodein.dtos.audio_v2_model import AudioV2
from screwmycodein.utils.youtube_dl_utils import YoutubeDlUtil


class AudioV2Service:
    @staticmethod
    def find_or_create(url: str):
        row = AudioV2.objects.filter(url=url).first()

        if row:
            return row

        info = YoutubeDlUtil.extract_info_new(url)

        new_row = AudioV2(
            url=url,
            title=info.title,
            audio=info.audio,
            image=info.image,
        )

        new_row.save()

        return new_row
