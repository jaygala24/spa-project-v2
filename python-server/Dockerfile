FROM python:slim

RUN pip3 install flask
RUN pip3 install requests

RUN useradd -ms /bin/bash server

WORKDIR /app

RUN mkdir logs
RUN chown -R server ./logs

RUN mkdir temp
RUN chown -R server temp

ENV NODE_SERVER_ROOT=
ENV NODE_SERVER_PORT=5000
ENV NODE_CALLBACK_ENDPOINT=api/api/output
ENV PORT=5001
ENV LOG_PATH=./logs/python-server-0.log

EXPOSE ${PORT}

COPY ./  /app/

USER server

CMD [ "python3","server.py" ]



