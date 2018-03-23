from __main__ import app
import json

@app.route('/api/')
@app.route('/api/<path:data_path>')
def api(data_path = ''):
    return json.dumps([fh[i] for i in fh if fh[i].attrs['temperature']==20])




def search(data_base):
    pass