FROM python:slim

RUN pip3 install flask
RUN pip3 install requests
RUN mkdir /var/log/spa
RUN chmod 777 /var/log/spa

USER 5000

WORKDIR /app

ENV NODE_SERVER_ROOT=
ENV NODE_SERVER_PORT=5000
ENV NODE_CALLBACK_ENDPOINT=api/api/output
ENV PORT=5001
ENV LOG_PATH=/var/log/spa/python-server-0.log

EXPOSE ${PORT}

COPY ./  /app/

CMD [ "python3","server.py" ]



