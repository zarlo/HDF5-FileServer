import numpy as np
import magic
import h5py
import os


class FileHelper(object):
  
    def __init__(self, db):
        self.db = h5py.File(db)
        self.magic_man = magic.Magic()

    def get(self):
        return self.db

    def list(self, path):
        return [key for key in self.db[path].keys()]

    def list_attr(self, path):
        return [key for key in self.db[path].attrs.keys()]

    def store_buff(self, buff, store_path):
        try:
            dt = h5py.special_dtype(vlen=np.dtype('uint8'))
            
            temp = self.db.create_dataset(store_path, (1,), dtype=dt)
        except:
            temp = self.db[store_path]

        temp[0] = np.fromstring(buff, dtype='uint8')   
        
        #self.db[store_path].attrs('mime') = self.magic_man.from_buffer(buff)

    def store_file(self, path, store_path):
        file = open(path, 'rb')
        self.store_buff(file.read(), store_path)
        
    def store_from_folder(self, path, save_path="", debug=False):
        for root, dirs, files in os.walk(path):
            for name in files:
                    t_path = os.path.join(root, name)
                    if debug:
                        print(t_path + '|||' + os.path.join(save_path, t_path))

                    self.store_file(t_path, os.path.join(save_path, t_path))

    def save_file(self, path, save_path):
        file = open(save_path, 'w')
        file.write(self.db[path][0])
        file.close()

    
