from __main__ import app
import json
import os

@app.route('/api/')
def api():
    db_list = []
    for root, dirs, files in os.walk('h5data/'):
        for filename in files:
            db_list.append(root.split('h5data/', 1)[1] + '/' + filename)
    print(db_list)
    return json.dumps(db_list)



def search(data_base):
    pass