from PIL import Image, ImageDraw
from sklearn.cluster import KMeans, MiniBatchKMeans
from collections import Counter
import numpy as np
import random
from random import randint
from flask import Flask
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request
import glob

app = Flask(__name__)
CORS(app)

pix_values=None
pix_labels=None
pix_list=None
color_options=[]
updated_data=[]
updated_labels = []

# images = ['tile3_small.jpg','tulips_small.jpg','legos2_small.jpg']
images = glob.glob('./small-images/*.jpg')
images_copy = []

@app.route('/load/<load_type>/')
def load_image(load_type):
    reset_values()

    global images
    global images_copy

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

    # path = images[game_counter]
    
    im = Image.open(path) 
    pix_val = np.array(list(im.getdata()))
    global pix_values
    global pix_list
    pix_list=[]
    for color in pix_val:
        for value in color:
            pix_list.append(int(value))
        pix_list.append(255)
    pix_values = pix_val
    return jsonify(image_size=im.size, pixel_values=pix_list)

@app.route('/options/<n_clusters>/')
def cluster_colors(n_clusters):
    global pix_values
    global pix_labels
    global color_options
    kmeans = MiniBatchKMeans(int(n_clusters))
    pix_labels = kmeans.fit_predict(pix_values)
    color_options = kmeans.cluster_centers_.astype(int).tolist()
    return jsonify(color_options=color_options)

@app.route('/choose/<choice>')
# @cross_origin(allow_headers=['Content-Type'])
def choose_color(choice):
    global pix_labels
    global pix_list
    global updated_data
    global color_options
    global updated_labels

    choice = int(choice)

    pix_labels_spread = np.repeat(np.array(pix_labels), 4)
    chosen_indices = np.where(pix_labels_spread == choice)
    np_pix_list = np.array(pix_list)

    if len(updated_data) == 0:
        data = np.array([255 for d in range(len(pix_list))])
        data[chosen_indices] = np_pix_list[chosen_indices]
        updated_data = data
        labels_count = update_labels(pix_labels, choice)
    else:
        updated_data[chosen_indices] = np_pix_list[chosen_indices]
        labels_count = update_labels(updated_labels, choice)

    # color_options = [color for (i, color) in enumerate(color_options) if i != int(choice)]
    color_options = [[] if i == choice else color for i, color in enumerate(color_options)]

    chosen_place = None
    for idx, (key, count) in enumerate(labels_count):
        if key == choice:
            chosen_place = idx

    del labels_count[chosen_place]

    return jsonify(pixel_values=updated_data.tolist(), color_options=color_options, chosen_place=chosen_place+1)

def update_labels(label_list, choice):
    global updated_labels
    labels_count = Counter(label_list).most_common()
    updated_labels = [label for label in label_list if label != choice]
    return labels_count

def reset_values():
    global pix_labels
    global pix_list
    global updated_data
    global color_options
    global updated_data
    pix_labels=[]
    pix_list=[]
    updated_data=[]
    color_options=[]
    updated_data=[]