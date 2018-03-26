from __main__ import app, get_data_path, get_mime_type

import h5py

from pathlib import Path

from flask import jsonify
import json
import os

def error_404(data):

    d = { 'status' : 'error', 'code' : 404, 'data' : data }

    return jsonify(d)




@app.route('/api/')
def api():
    db_list = []
    for root, dirs, files in os.walk('h5data/'):
        for filename in files:
            db_list.append(root.split('h5data/', 1)[1] + '/' + filename)
    print(db_list)
    return json.dumps(db_list)

@app.route('/api/<string:data_path>/')
@app.route('/api/<string:data_path>')
def root_db_api(data_path):
    print('db root')
    return db_api(data_path)

@app.route('/api/<path:data_path>')
def db_api(data_path):
    temp = get_data_path(data_path)

    db = temp[0]
    path = temp[1] 

    print(db)
    print(path)

    if Path(db).is_file() is False:
        return error_404('db not found')
    else:

        try:
            file = h5py.File(db, 'r')[path]
        except:
            return error_404("there was an error i think it was just a 404 error")
    
    if isinstance(file, h5py.Dataset):
        output = { "type" : "file"}
    else:
        output = { "type" : "folder", "data" : [key for key in file.keys()] }


    return jsonify(output)



def search(data_base):
    pass