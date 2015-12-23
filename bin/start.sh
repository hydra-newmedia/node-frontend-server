#!/usr/bin/env bash

CURR_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR=$(dirname ${CURR_DIR})
PM2=${BASE_DIR}/node_modules/pm2/bin/pm2

${PM2} start ${BASE_DIR}/config.json

# wait forever (until SIGTERM or SIGINT, see above)
# default behaviour: blocking, if no parameter 'non-blocking'/'nb' given
if [ "$1" != "non-blocking" ] && [ "$1" != "nb" ]; then
    echo "blocking script"
    while true; do
        sleep 10000
    done
fi