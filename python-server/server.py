from flask import Flask, request, Response, jsonify,json
import logging
from multiprocessing import Process
import requests
import os
from config.lang_config import langs
from util.compile import compile_and_run_code


# Set this according to env vars in deployment
LOG_PATH=os.environ.get('LOG_PATH')
EXPRESS_BASE_URL = os.environ.get('NODE_SERVER_ROOT')+':'+os.environ.get('NODE_SERVER_PORT')+'/'
EXPRESS_RETURN_ROUTE = os.environ.get('NODE_CALLBACK_ENDPOINT')
SERVER_PORT = os.environ.get('PORT')
SERVER_HOST = '0.0.0.0'


# Helper function
def compile_and_send(data):
    lang = langs[data['lang']]
    code = data['code']
    ip = data['input']
    meta  = data['metadata']

    # actually compile and run
    ret = compile_and_run_code(lang,code,ip)
    ret['metadata'] = meta

    app.logger.info('completed compiling for metadata : {} , success : {}, timeout : {}'.format(data['metadata'],ret['success'],ret['timeout']))

    post_route = EXPRESS_BASE_URL+EXPRESS_RETURN_ROUTE
    
    # must set headers , as sending data without header will cause error in parsing booleans on express side
    headers = {'content-type': 'application/json'}

    app.logger.info('Returning output for metadata : {}'.format(data['metadata']))

    # make a post request to Main express server
    return requests.post(post_route,json.dumps(ret),headers=headers)


# setup server
app = Flask(__name__);
logging.basicConfig(filename=LOG_PATH,level=logging.INFO);

@app.route('/compile',methods=['POST'])
def compile():
    data = request.json

    # sanity checks
    if 'lang' not in data or 'code' not in data or 'input' not in data or 'metadata' not in data:
        return Response(json.dumps({'success': False,'error':'Invalid request'}), mimetype="application/json", status=400)    

    if data['lang'] not in langs:
        return Response(json.dumps({'success': False,'error':'language not supported'}), mimetype="application/json", status=400)    

    # log the info
    app.logger.info('starting compiling for metadata : {}'.format(data['metadata']))

    # start the process to run the compiling code, which itself will start new subprocess to actually compile and run code
    Process(target=compile_and_send,args=(data,)).start()

    # Sending response to server
    app.logger.info('Responding to compile request for metadata : {}'.format(data['metadata']))

    # We do not wait for for it to join
    # We immediately return success as we have received the code
    return Response(json.dumps({'success': True}), mimetype="application/json", status=200)


# set debug=True for nodemon like facilities
app.run(host=SERVER_HOST, port=SERVER_PORT,debug=False)