#!/bin/bash
sed -i "s/VERSION = \(.\)*/VERSION = '$NEXT_VERSION';/" screwmycodein/version.py
