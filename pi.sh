#!/usr/bin/env bash

source ./build.sh
scp "${PWD}/grainfather-influxdb.zip" pi@pi-zero-2:/home/pi/apps/grainfather-influxdb

ssh -t pi@pi-zero-2 'cd apps/grainfather-influxdb && \
    unzip -o grainfather-influxdb.zip'
