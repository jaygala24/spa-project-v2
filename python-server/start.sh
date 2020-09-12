#! /bin/bash

# set the env vars, for docker deploy these will be set from the docker file/docker compose file

export NODE_SERVER_ROOT=http://localhost
export NODE_SERVER_PORT=8000
export NODE_CALLBACK_ENDPOINT=result
export PORT=5000

python3 server.py