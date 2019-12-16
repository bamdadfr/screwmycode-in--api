# api.screwmycode.in

Node.js API for retrieving audio sources URLs from YouTube links.

*Based on youtube-dl https://github.com/ytdl-org/youtube-dl*

## Docker Image Building

```bash
docker build -t api.screwmycode.in .
```

## Docker Container Usage

```bash
docker run -d --name api -p 8080:5000 api.screwmycode.in
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
