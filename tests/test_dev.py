import requests

BASE_URL = "http://localhost:8000"


def get_url(endpoint: str) -> str:
    return f"{BASE_URL}{endpoint}"


def __test_200(endpoint: str):
    url = get_url(endpoint)
    response = requests.get(url)
    assert response.status_code == 200
    return response


def __test_404(endpoint: str):
    url = get_url(endpoint)
    response = requests.get(url)
    assert response.status_code == 404
    return response


def test_home():
    __test_200("/")


def test_last():
    __test_200("/last")


def test_last_count_1():
    response = __test_200("/last?count=1")
    data = response.json()
    assert len(data) == 1


def test_last_count_oob():
    response = __test_200("/last?count=-1")
    data = response.json()
    assert len(data) == 1

    response = __test_200("/last?count=200")
    data = response.json()
    assert len(data) <= 50


def test_last_hour():
    __test_200("/last/hour")


def test_last_day():
    __test_200("/last/day")


def test_last_week():
    __test_200("/last/week")


def test_last_month():
    __test_200("/last/month")


def test_top():
    __test_200("/top")


def test_top_count_1():
    response = __test_200("/top?count=1")
    data = response.json()
    assert len(data) == 1


def test_top_oob():
    response = __test_200("/top?count=-1")
    data = response.json()
    assert len(data) == 1

    response = __test_200("/top?count=200")
    data = response.json()
    assert len(data) <= 50


def test_top_index_today():
    __test_200("/top/today")


def test_top_yesterday():
    __test_200("/top/yesterday")


def test_top_hour():
    __test_200("/top/hour")


def test_top_week():
    __test_200("/top/week")


def test_top_month():
    __test_200("/top/month")


def test_youtube_index():
    __test_200("/youtube")


def test_youtube_valid():
    response = __test_200("/youtube/7Wzw88xC7I4")
    data = response.json()

    image = requests.head(data["image"])
    assert image.status_code == 200

    audio = requests.head(data["audio"])
    assert audio.status_code == 200


def test_youtube_malformed():
    __test_404("/youtube/7Wzw88xC7I4___")


def test_youtube_invalid():
    __test_404("/youtube/7Wzw88xC7I3")


def test_soundcloud_index():
    __test_200("/soundcloud")


def test_soundcloud_valid():
    response = __test_200("/soundcloud/ilyacesavage/scheming-prod-cormill")

    data = response.json()
    image = requests.head(data["image"])
    assert image.status_code == 200

    audio = requests.head(data["audio"])
    assert audio.status_code == 200


def test_soundcloud_invalid():
    __test_404("/soundcloud/ilyacesavage/scheming-prod-cormill___")


def test_bandcamp_valid():
    response = __test_200("/bandcamp/seim/echos-of-the-past")

    data = response.json()
    image = requests.head(data["image"])
    assert image.status_code == 200

    audio = requests.head(data["audio"])
    assert audio.status_code == 200
