# api.screwmycode.in

Node.js API for retrieving audio sources URLs from YouTube links.
*Based on youtube-dl https://github.com/ytdl-org/youtube-dl *

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
   "url":"https://r2---sn-n4g-ator.googlevideo.com/videoplayback?expire=1576518144&ei=n233XYT5Ns3zVr-bqLgM&ip=77.140.139.63&id=o-APvyVg-O3aQtXhETBUVNIYzYDzTDF53bpsM-PxAeoMij&itag=140&source=youtube&requiressl=yes&mm=31%2C29&mn=sn-n4g-ator%2Csn-n4g-jqber&ms=au%2Crdu&mv=m&mvi=1&pcm2cms=yes&pl=24&gcr=fr&initcwndbps=1751250&mime=audio%2Fmp4&gir=yes&clen=8771037&dur=541.826&lmt=1565950321502836&mt=1576496455&fvip=6&keepalive=yes&fexp=23842630&c=WEB&txp=5431432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=AHylml4wRAIgEg69gaSTGr7U5MH1cYY943jRR5IZMmmR_x9J0bPvoC0CIG5PXJPji3IyxGJFrrjKhVWBZLijzKvdyqfcZ6tj8DI6&sig=ALgxI2wwRQIhAJwUdF4OKgf_2_BkfwcGYUBD3nnlfnhEV0-D_XXbDoTzAiB3x_QlFlfAgbWdxQBj657yhLvxTiemdUoWuKqBktZUOQ==&ratebypass=yes",
   "dashUrl":null,
   "err":""
}
```
