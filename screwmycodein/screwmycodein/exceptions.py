from screwmycodein.screwmycodein.audio.models import Audio


class AudioTypeUnknownException(Exception):
    pass


class InvalidSlugException(Exception):
    def __init__(self):
        super().__init__("Invalid slug")


class AudioVerificationException(Exception):
    def __init__(self, err: Exception, row: Audio):
        print(row.type, row.slug, err)
