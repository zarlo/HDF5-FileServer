#!/usr/bin/python
from flask import Flask
from hdf5helper import FileHelper
import magic

app = Flask(__name__)

magic_man = magic.Magic()

def get_mime_type(buffer, db = None):

    if db is None:
        return magic_man.from_buffer(buffer)
    else:
        return db[buffer].attrs('mime')


def get_data_path(path):
    temp = path.split('.h5')

    temp[0] = 'h5data/' + temp[0] + '.h5'

    if len(temp) is not 2: 
        temp[1] = '/'

    if temp[1] is '':
        temp[1] = '/'
    return temp


import api
import FileHost


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)