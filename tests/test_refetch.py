from time import sleep

import requests as r1
import requests as r2


def test_refetch():
    url = "http://localhost:8000/youtube/7Wzw88xC7I4"
    print(url)

    a = r1.get(url)
    assert a.status_code == 200
    audio_1 = a.json()["audio"]
    print(audio_1)

    sleep(10)

    b = r2.get(url)
    assert b.status_code == 200
    audio_2 = a.json()["audio"]
    print(audio_2)

    assert audio_1 == audio_2
