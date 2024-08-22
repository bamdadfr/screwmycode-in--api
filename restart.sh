#!/bin/bash
source /home/aent4329/virtualenv/screwmycodein/3.11/bin/activate && cd /home/aent4329/screwmycodein
pip install -r requirements.txt
touch tmp/restart.txt
deactivate
