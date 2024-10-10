class AudioTypeUnknownException(Exception):
    pass


class InvalidSlugException(Exception):
    def __init__(self):
        super().__init__("Invalid slug")
