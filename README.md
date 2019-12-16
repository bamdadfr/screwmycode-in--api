# api.screwmycode.in

Node.js API for retrieving audio sources URLs from YouTube links.

*Based on youtube-dl https://github.com/ytdl-org/youtube-dl*

## Build image

```bash
docker build -t bamdadsabbagh/api.screwmycode.in .
```

## Retrieve image from Docker Hub

```bash
docker pull bamdadsabbagh/api.screwmycode.in
```

## Start container

```bash
docker run -d --name api.screwmycode.in --restart=always -p 5000:5000 bamdadsabbagh/api.screwmycode.in
```

## Examples

Request:

```bash
# YouTube URL
https://www.youtube.com/watch?v=ZLvNeh5KNh0

# Dockerized API Request URL
http://localhost:8080/youtube/ZLvNeh5KNh0
```

Response:

```json
{
   "success":true,
   "type":"audio",
   "title":"Demain, c'est loin (Instrumental)",
   "url":"***URL***",
   "dashUrl":null,
   "err":""
}
```
