# Python Server For compiling

This is a standalone python Flask server for compiling the code and then sending the answers.  

This contains single route /compile , which supports POST, on which the code, the input and the metadata related (socket id and all) must be submitted. This creates a new Process to run actual compiling and running work, and without waiting for completion of it, it return the 200 response. 
In the new process a function is invoked which itself create new subprocess to compile and run the code. The output stdout and stderr, along with metadata is sent to Express server **(whose Base URL and specific route is currently hard coded, in deployment should be set using env vars)** on specific route using requests module

## Requirements
The System running this server must have flask and requests modules installed globally , along with the required compilers and interpreters.
Python version is >=3.8

If running with docker, docker needs to be installed

## Running
#### To build image :
(Inside python folder)
docker build --tag spa-python-test:0.1 .
#### To create volume
docker volume create spa

#### To run container
docker run -it -v spa:/var/log/spa -p 5001:5001 spa-python-test:0.1