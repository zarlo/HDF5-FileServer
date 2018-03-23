#!bin/python3
import sys
import tarfile
import shutil
import os

from hdf5helper import FileHelper



db_path = sys.argv[1]
folder_path = sys.argv[2]
save_path = sys.argv[3]

print(db_path)
print(folder_path)
print(save_path)

f = FileHelper(db_path)

if '.tar' in folder_path:
    tar_file = open(folder_path, 'rb')
    tar = tarfile.open(fileobj=tar_file, mode='r')
    print('tar file loaded')

    maxitems = len(tar.getmembers())
    citem = 0
    for item in tar.getmembers():
        citem = citem + 1 
        math = (citem / maxitems) * 100
        if item.isreg():
            tar.extract(item, 'temp/')
            f.store_file('temp/' + item.name, os.path.join(save_path, item.name))
            os.remove('temp/' + item.name)


        sys.stdout.write("\r" + '%.2f' % math + '% Done.')
        sys.stdout.flush()
        

    shutil.rmtree('temp/')
    tar.close()
    tar_file.close()

else:
    print('i might add a ETA one day')
    f.store_from_folder(folder_path, save_path, True)
    print('DONE')


