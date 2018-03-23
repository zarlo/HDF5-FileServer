from flask import Flask
from hdf5helper import FileHelper


app = Flask(__name__)

import api
import FileHost


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)