#!/bin/bash

DOCKER="/usr/bin/docker"

# Build the docker image
$DOCKER build -t craftery/seas-frontend:latest -t craftery/seas-frontend:1.0.11 .

# Push the image to docker hub
$DOCKER push craftery/seas-frontend -a