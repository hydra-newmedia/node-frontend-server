#!/usr/bin/env bash

CURR_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR=$(dirname ${CURR_DIR})
PM2=${BASE_DIR}/node_modules/pm2/bin/pm2

${PM2} delete ${BASE_DIR}/config.json