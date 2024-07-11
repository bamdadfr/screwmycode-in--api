#!/bin/bash
source /home/aent4329/virtualenv/screwmycodein/3.11/bin/activate && cd /home/aent4329/screwmycodein
youtube-dl --rm-cache-dir
rm -r /home/aent4329/virtualenv/screwmycodein/3.11/lib/python3.11/site-packages/youtube_dl*
pip install -r requirements.txt
touch tmp/restart.txt
deactivate
