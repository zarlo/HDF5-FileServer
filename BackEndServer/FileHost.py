from flask import Flask, render_template, request, make_response, redirect
from pathlib import Path
from __main__ import app
from io import BytesIO
from PIL import Image
import numpy as np
import datetime
import magic
import h5py
import glob
import os



thumbnail_db = h5py.File('thumbnail.h5', 'a')

icons_db = h5py.File('icons.h5', 'a')


magic_man = magic.Magic()

@app.route('/thumbnail/<path:data_path>')
def thumbnail_route(data_path):
    temp = get_data_path(data_path)
    db = temp[0]
    path = temp[1]
    file = h5py.File(db)[path]
    return get_thumnail(file ,db, path)

@app.route('/')
def list_dbs():
    return index('')

@app.route('/<path:data_path>')
def index(data_path):


    if '.h5' not in data_path:

        db_list = []
        for root, dirs, files in os.walk('h5data/' + data_path):
            for filename in files:
                db_list.append(root.split('h5data/', 1)[1] + '/' + filename)
                        

        return render_template("list.html", url='', list=db_list, show=True)
    temp = get_data_path(data_path)

    db = temp[0]
    path = temp[1] 
    
    if Path(db).is_file() is False:
        return render_template('errors/404.html', msg='no DB with the name "' + db + '"')

    try:
        file = h5py.File(db)[path]
    except:
        return render_template('errors/404.html', msg="there was an error i think it was just a 404 error")

    is_dataset = isinstance(file, h5py.Dataset)

    if is_dataset is True:

            response = make_response(file[0].tobytes())
            response.headers.set('Content-Type', get_mime_type(file[0].tobytes()) )
            return response

    else:

        link = request.path

        if link.endswith('/') is False:
            link += "/"

        return render_template("list.html", url=link, list=[key for key in file.keys()])


def get_data_path(path):
    temp = path.split('.h5')

    temp[0] = 'h5data/' + temp[0] + '.h5'

    if len(temp) is not 2: 
        temp[1] = '/'

    if temp[1] is '':
        temp[1] = '/'
    return temp


def get_mime_type(buffer, db = None):

    if db is None:
        return magic_man.from_buffer(buffer)
    else:
        return db[buffer].attrs('mime')


def make_thumbnail(name, buffer):
    size = 160, 160
    im = Image.open(BytesIO(buffer))
    im.thumbnail(size, resample=Image.NEAREST)

    imgByteArr = BytesIO()
    im.save(imgByteArr, format='JPEG')
    imgByteArr = imgByteArr.getvalue()

    try:
        dt = h5py.special_dtype(vlen=np.dtype('uint8'))
        temp = thumbnail_db.create_dataset(name, (1,), dtype=dt)
    except:
        temp = thumbnail_db[name]

    temp[0] = np.fromstring(imgByteArr, dtype='uint8')


def get_thumnail(db_file, db, path):
    global thumbnail_db

    if not os.path.exists("thumbnails.h5"):
        thumbnail_db = h5py.File('thumbnail.h5', 'a')
    thumbnail_path = db + '/' + path

    is_dataset = isinstance(db_file, h5py.Dataset)

    if is_dataset is False :
        #this will be a folder
        return redirect("http://icons.iconarchive.com/icons/dtafalonso/yosemite-flat/512/Folder-icon.png", code=302)

    try:
        mime_type = get_mime_type(db_file[0].tobytes())
    except:
        mime_type = get_mime_type(db_file[0].tobytes(), db)

    if "image" in mime_type :

        try:
            output = thumbnail_db[thumbnail_path][0].tobytes()
        except:
            make_thumbnail(thumbnail_path, db_file[0].tobytes())
            output = thumbnail_db[thumbnail_path][0].tobytes()

        thumbnail_db[thumbnail_path].attrs['last'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        response = make_response(output)
        response.headers.set('Content-Type', get_mime_type(output))
        return response


    try:
        output = icons_db[get_mime_type(db_file[0].tobytes())][0].tobytes()
        response = make_response(output)
        response.headers.set('Content-Type', get_mime_type(output))
        return response
    except:
        return redirect("http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/file-text-icon.png", code=302)
            