#!/bin/bash
tar czvf ball.tar.gz --exclude="venv" --exclude=".git" --exclude=".idea" --exclude="__pycache__" --exclude="node_modules" *
