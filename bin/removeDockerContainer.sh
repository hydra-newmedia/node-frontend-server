#!/bin/bash

CONTAINER_NAME=$1

if [ -z "${CONTAINER_NAME}" ]; then
    echo "No container name as 1. argument provided"
    exit 1
else
    echo "Container-Name: ${CONTAINER_NAME}"
fi

ID=`docker ps | grep "${CONTAINER_NAME}" | grep -oh "^\S*" | xargs`

if [ ! -z "${ID}" -a "${ID}"!=" " ]; then
    echo "Container '${CONTAINER_NAME}' exists with ID '${ID}' and will be removed"
    docker rm -f "${ID}"
    echo "Container '${CONTAINER_NAME}' removed"
else
    echo "Container did not exist previously"
fi