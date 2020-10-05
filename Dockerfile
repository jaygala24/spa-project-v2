FROM node:12.18.4-buster-slim

RUN mkdir /var/log/spa
RUN chmod 777 /var/log/spa
RUN  chown -R 5000 /var/log/spa

WORKDIR /app

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
ENV PYTHON_PORT_ROOT=http://localhost
ENV PYTHON_SERVER_PORTS_START=5001
ENV PYTHON_SERVER_NUMBER=1
ENV PYTHON_SERVER_ENDPOINT=compile
ENV PYTHON_CALLBACK_ENDPOINT=output
ENV LOG_PATH=./logs/node.log
ENV MONGO_USER=dummy_user
ENV MONGO_PASSWORD=spa_deploy_dummy

COPY ./ /app/

RUN npm run build
RUN npm run build-client

EXPOSE 5000

RUN useradd -ms /bin/bash server

RUN mkdir logs
RUN chown -R server ./logs

USER server

CMD [ "npm","run","start" ]