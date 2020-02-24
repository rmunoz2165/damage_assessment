import os
import io
import time
import requests
import pandas as pd
from flask import Flask
from flask import jsonify
from flask_cors import CORS
from google.cloud import vision
from sklearn.pipeline import Pipeline
from google.cloud.vision import types
from google.oauth2 import service_account
from sklearn.linear_model import LogisticRegressionCV
from google.protobuf.json_format import MessageToDict
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split, GridSearchCV

app = Flask(__name__)
CORS(app)

CONFIG_FILE = './config.json'
WORDS_FILE = 'words_from_google_vision_1.csv'

GOOGLE_SERVICE_KEY = pd.read_json(CONFIG_FILE)["KEYS"]["GOOGLE_SERVICE_KEY"]
credentials = service_account.Credentials.from_service_account_file(GOOGLE_SERVICE_KEY)
client = vision.ImageAnnotatorClient(credentials=credentials)


def get_google_vision_words(file_name):

    # Loads the image into memory
    with io.open(file_name, 'rb') as image_file:
        content = image_file.read()
    image = types.Image(content=content)
    response = client.label_detection(image=image, max_results=100)
    time.sleep(5)
    res = MessageToDict(response)

    return res


def get_labels(e, res, col_no):
    new_lst = []
    for i in range(len(res["labelAnnotations"])):
        new_lst.append(res["labelAnnotations"][i]["description"])

    return ((e, new_lst))


def get_estimator():
    data = pd.read_csv(WORDS_FILE)
    data.drop(columns="Unnamed: 0", inplace=True)
    X = data["Words"]
    y = data["TRUE"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, shuffle=True, stratify=y, test_size=0.20, random_state=42)

    params = {
        1: {"Pipeline": [('vectorizer', CountVectorizer()),
                         ('classifier', LogisticRegressionCV(random_state=42))],
            "hyper_params": {
                'vectorizer__ngram_range': [(1, 1), (1, 2), (1, 3), (1, 4)]}
            }
    }

    pipe = Pipeline(params[1]["Pipeline"])
    hyper_params = params[1]["hyper_params"]

    # Perform Grid Search
    gridcv = GridSearchCV(pipe,
                          param_grid=hyper_params,
                          cv=5,
                          scoring="accuracy")
    return gridcv.fit(X_train, y_train).best_estimator_


def get_image_google_vision_words(url):

    response_img = requests.get(url, timeout=180)
    image = types.Image(content=response_img.content)
    response = client.label_detection(image=image, max_results=100)
    time.sleep(5)
    res = MessageToDict(response)

    return res

@app.route('/get_prediction/<path:image_url>', methods=['POST'])
def get_prediction(image_url):
    data_from_img = []
    model = get_estimator()
    res = get_image_google_vision_words(image_url)
    data_from_img.append(get_labels(image_url, res, 0))
    df = pd.DataFrame(data_from_img, columns=["url", "Words"])
    df["Words"] = df["Words"].astype(str)
    value = int(model.predict(df["Words"])[0])
    return jsonify(value=value)


@app.route('/')
def hello_world():
    target = os.environ.get('TARGET', 'World')
    return jsonify(message=target)


@app.route('/gouri')
def gouri():
    return jsonify(message="Hello Gouri!!")


@app.route('/user/<username>')
def profile(username):
    return jsonify(message="Hello {}!!".format(username))


@app.route('/user/id/<int:user_id>')
def profileid(user_id):
    return jsonify(message="UserID: {}}!!".format(user_id))


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
