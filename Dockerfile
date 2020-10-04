FROM node:12.18.4-buster-slim

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm ci

RUN mkdir client

COPY ./client/package.json /app/client
COPY ./client/package-lock.json /app/client

RUN cd /app/client && npm ci

COPY ./ /app/

RUN npm run build
RUN npm run build-client


ENV NODE_ENV=production
ENV PORT=5000
ENV JWT_KEY=mfdsioanf23412*(+^#
ENV JWT_EXP=24h
ENV PYTHON_PORT_ROOT=http://localhost
ENV PYTHON_SERVER_PORTS_START=5001
ENV PYTHON_SERVER_NUMBER=1
ENV PYTHON_SERVER_ENDPOINT=compile
ENV PYTHON_CALLBACK_ENDPOINT=output
ENV LOG_PATH=/var/log/spa/node.log

EXPOSE 5000

CMD [ "npm","run","start" ]