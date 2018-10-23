from PIL import Image, ImageDraw
from io import BytesIO
from sklearn.cluster import KMeans, MiniBatchKMeans
from collections import Counter
import numpy as np
import random
from random import randint
from flask import Flask, send_file
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request
import glob
import base64

app = Flask(__name__)
CORS(app)

pix_values=[]
pix_labels=[]
color_options=[]
updated_data=[]
updated_labels = []
image_size = ()

# images = ['tile3_small.jpg','tulips_small.jpg','legos2_small.jpg']
images = glob.glob('./small-images/*.jpg')
images_copy = []

@app.route('/load/<load_type>/')
def load_image(load_type):
    reset_values()

    global images
    global images_copy
    global image_size
    global pix_values

    if load_type == 'new':
        images_copy = images.copy()
        path = random.choice(images)
        images_copy.remove(path)

    elif load_type == 'next':
        path = random.choice(images_copy)
        images_copy.remove(path)

        if len(images_copy) == 0:
            images_copy = images.copy()
            images_copy.remove(path)

    img = Image.open(path) 
    pix_values = np.array(list(img.getdata()))
    
    image_size = img.size

    string_png = convertImagetoString(img)

    return jsonify(image_size=image_size, png_data=string_png)

@app.route('/options/<n_clusters>/')
def cluster_colors(n_clusters):
    global pix_values
    global pix_labels
    global color_options
    kmeans = MiniBatchKMeans(int(n_clusters))
    pix_labels = kmeans.fit_predict(pix_values)
    color_options = kmeans.cluster_centers_.astype(int).tolist()
    return jsonify(color_options=color_options)

@app.route('/choose/<choice>/')
def choose_color(choice):
    global pix_labels
    global pix_values
    global updated_data
    global color_options
    global updated_labels
    global image_size

    choice = int(choice)

    pix_labels_spread = np.repeat(np.array(pix_labels), 3)
    chosen_indices = np.where(pix_labels_spread == choice)
    np_pix_values = np.array(pix_values).flatten()

    if len(updated_data) == 0:
        data = np.array([255 for d in range(len(np_pix_values))])
        data[chosen_indices] = np_pix_values[chosen_indices]
        updated_data = data
        labels_count = update_labels(pix_labels, choice)
    else:
        updated_data[chosen_indices] = np_pix_values[chosen_indices]
        labels_count = update_labels(updated_labels, choice)

    color_options = [[] if i == choice else color for i, color in enumerate(color_options)]

    chosen_place = None
    for idx, (key, count) in enumerate(labels_count):
        if key == choice:
            chosen_place = idx

    del labels_count[chosen_place]

    img = Image.frombytes("RGB", image_size, bytes(updated_data.astype('uint8')))

    string_png = convertImagetoString(img)

    return jsonify(png_data=string_png, color_options=color_options, chosen_place=chosen_place+1)

def update_labels(label_list, choice):
    global updated_labels
    labels_count = Counter(label_list).most_common()
    updated_labels = [label for label in label_list if label != choice]
    return labels_count

def reset_values():
    global pix_labels
    global updated_data
    global color_options
    global updated_data
    global pix_values
    pix_values=[]
    pix_labels=[]
    updated_data=[]
    color_options=[]
    updated_data=[]

def convertImagetoString(image):
    byte_io = BytesIO()
    image.save(byte_io, 'PNG')
    return base64.b64encode(byte_io.getvalue()).decode('utf-8')