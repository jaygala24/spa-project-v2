FROM node:12.18.4-buster-slim

RUN useradd -ms /bin/bash server

WORKDIR /app

RUN mkdir logs
RUN chown -R server ./logs

COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm ci

RUN mkdir client

COPY ./client/package.json /app/client
COPY ./client/package-lock.json /app/client

RUN cd /app/client && npm ci

ENV NODE_ENV=production
ENV PORT=5000
ENV JWT_KEY=mfdsioanf23412*(+^#
ENV JWT_EXP=24h
ENV PYTHON_PORT_ROOT=http://python
ENV PYTHON_SERVER_CONTAINER_START=0
ENV PYTHON_SERVER_NUMBER=1
ENV PYTHON_PORT=5001
ENV PYTHON_SERVER_ENDPOINT=compile
ENV PYTHON_CALLBACK_ENDPOINT=output
ENV LOG_PATH=./logs/node.log
ENV MONGO_USER=dummy_user
ENV MONGO_PASSWORD=spa_deploy_dummy

EXPOSE ${PORT}

COPY ./ /app/

RUN npm run build
RUN npm run build-client

USER server

CMD [ "npm","run","start" ]