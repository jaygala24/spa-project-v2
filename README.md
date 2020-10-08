# SPA Project V2

This repo contains starter template for the SPA project v2

## API Documentation

The latest documentation for the API is available here

[View](https://documenter.getpostman.com/view/6151365/SzRxWAPy?version=latest)

## Setup Instructions

Clone the repository

```
git clone https://github.com/jaygala24/spa-project-v2.git
cd spa-project-v2
```

## Development

```
# Install server dependencies
yarn
# Install client dependencies
yarn client
# Run the client and server concurrently
yarn dev
```

## Production

### Docker
#### For generating compose file :
Run generate-compose.py and give the necessary inputs, which will then generate a docker-compose.yaml file
docker-compose_og.yaml is the original handwritten compose file, with single node and single python server
#### To build 
docker build --tag spa-node-test:0.1 .
#### To run 
docker run -it  -p 5000:5000 -v logs:/app/logs:rw --user server  spa-node-test:0.1


```
cd src/config
# open config.env and change the NODE_ENV=production and MongoURI
# navigate to the root folder
yarn start
```

## Note

This template incorporates central error handling. You can create the custom error for the API's using the following:

- Create the error object using the ErrorHandler class which takes the statusCode and message `const err = new Error(500, 'Not Found')`
- Call the handleError function which takes the error and response `handleError(err, res)`

## License

> MIT License
>
> Copyright (c) 2020 Jay Gala
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
