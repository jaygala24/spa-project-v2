#! /usr/bin/bash

# This is a temp script which can be used to launch dev node server and pyhton server for 
# dev testing
# in deployment all operations will be taekn care of by docker compose

npm run dev &
cd ./python-server && ./start.sh