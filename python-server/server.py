from flask import Flask, request, Response, jsonify,json

from multiprocessing import Process
import requests

from config.lang_config import langs
from util.compile import compile_and_run_code

# Set this according to env vars in deployment
EXPRESS_BASE_URL = 'http://localhost:5000'
EXPRESS_RETURN_ROUTE = '/output'
SERVER_PORT = 5001
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

    post_route = EXPRESS_BASE_URL+EXPRESS_RETURN_ROUTE
    
    # must set headers , as sending data without header will cause error in parsing booleans on express side
    headers = {'content-type': 'application/json'}

    # make a post request to Main express server
    return requests.post(post_route,json.dumps(ret),headers=headers)


app = Flask(__name__);

@app.route('/compile',methods=['POST'])
def compile():
    data = request.json

    # sanity checks
    if 'lang' not in data or 'code' not in data or 'input' not in data or 'metadata' not in data:
        return Response(json.dumps({'success': False,'error':'Invalid request'}), mimetype="application/json", status=400)    

    if data['lang'] not in langs:
        return Response(json.dumps({'success': False,'error':'language not supported'}), mimetype="application/json", status=400)    

    # start the process to run the compiling code, which itself will start new subprocess to actually compile and run code
    Process(target=compile_and_send,args=(data,)).start()
    # We do not wait for for it to join
    # We immediately return success as we have received the code
    return Response(json.dumps({'success': True}), mimetype="application/json", status=200)

# set debug=True for nodemon like facilities
app.run(host=SERVER_HOST, port=SERVER_PORT,debug=False)