from screwmycodein.db.media_model import MediaModel
from screwmycodein.utils.youtube_dl_utils import YoutubeDlUtil


class MediaService:
    @staticmethod
    def find_or_create(url: str):
        row = MediaModel.objects.filter(url=url).first()

        if row:
            return row

        info = YoutubeDlUtil.extract_info_new(url)

        new_row = MediaModel(
            url=url,
            title=info.title,
            audio=info.audio,
            image=info.image,
        )

        new_row.save()

        return new_row
