#! /bin/bash

# set the env vars, for docker deploy these will be set from the docker file/docker compose file

export NODE_SERVER_ROOT=http://localhost
export NODE_SERVER_PORT=5000
export NODE_CALLBACK_ENDPOINT=output
export PORT=5001
export LOG_PATH=./logs/python-server-0.log

python3 server.py