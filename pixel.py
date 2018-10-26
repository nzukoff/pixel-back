from PIL import Image, ImageDraw
from io import BytesIO
from sklearn.cluster import MiniBatchKMeans
from collections import Counter
import numpy as np
import random
from flask import Flask, session, jsonify, request
from flask_cors import CORS
import glob
import base64
import zlib

app = Flask(__name__)
CORS(app)

@app.route('/load/<load_type>', methods=['POST'])
def load_image(load_type):
    titles = request.get_json()['titles']
    title_paths = np.array(['./small-images/' + t + '.jpg' for t in titles])
    images = np.array(glob.glob('./small-images/*.jpg'))

    if (len(titles) != len(images)):
        unplayed_images = images[~np.in1d(images, title_paths)]
    else:
        unplayed_images = images
        titles = []

    path = random.choice(unplayed_images)
    img = Image.open(path) 
    image_size = img.size
    string_png = convertImagetoString(img)
    title=path[15:-4]
    titles.append(title)

    return jsonify(image_size=image_size, png_data=string_png, title=title, titles=titles)

@app.route('/options/<n_clusters>')
def cluster_colors(n_clusters):
    path = './small-images/' + request.args['title'] + '.jpg'
    img = Image.open(path) 
    pix_values = np.array(list(img.getdata()))

    kmeans = MiniBatchKMeans(int(n_clusters))
    pix_labels = kmeans.fit_predict(pix_values)
    color_options = kmeans.cluster_centers_.astype(int).tolist()

    pix_label_bytes = bytearray(len(pix_labels)//2)
    byte = 0
    for idx, pix in enumerate(pix_labels):
        if idx % 2 == 0:
            byte = pix << 4
        else:
            byte = byte | (pix & 0x0f)
            pix_label_bytes[idx//2] = byte

    comp_labels = zlib.compress(pix_label_bytes)
    str_labels = base64.b64encode(comp_labels).decode('utf-8')

    return jsonify(color_options=color_options, labels=str_labels)

@app.route('/choose/<choice>', methods=['POST'])
def choose_color(choice):
    choice = int(choice)

    path = './small-images/' + request.args['title'] + '.jpg'

    img = Image.open(path) 
    image_size = img.size
    pix_values = np.array(list(img.getdata()))

    str_labels = request.get_json()['labels']
    comp_labels = base64.b64decode(str_labels)
    uncompressed_labels = zlib.decompress(comp_labels)
    numpy_labels = np.empty((len(uncompressed_labels)*2,), dtype='uint8')
    for idx, value in enumerate(uncompressed_labels):
        numpy_labels[idx*2] = value >> 4
        numpy_labels[idx*2+1] = value & 0x0f

    choices = request.get_json()['choices']
    choices.append(choice)

    data = np.array([[255, 255, 255] for d in range(len(pix_values))])
    indices = []
    for c in choices:
        found = np.where(numpy_labels == c)[0]
        for i in found:
            indices.append(i)
    data[indices] = pix_values[indices]

    img = Image.frombytes("RGB", image_size, bytes(data.astype('uint8')))

    string_png = convertImagetoString(img)

    updated_labels = numpy_labels[~np.in1d(numpy_labels, choices[:-1])]
    labels_count = Counter(updated_labels).most_common()
    chosen_place = None
    for idx, (key, count) in enumerate(labels_count):
        if key == choice:
            chosen_place = idx

    return jsonify(png_data=string_png, chosen_place=chosen_place+1, choices=choices)

def convertImagetoString(image):
    byte_io = BytesIO()
    image.save(byte_io, 'PNG')
    return base64.b64encode(byte_io.getvalue()).decode('utf-8')