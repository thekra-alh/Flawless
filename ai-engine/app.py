import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from flask import Flask, request, jsonify

app = Flask(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "acne_model_448.keras")
IMG_SIZE = 448

LABELS = [
    "Level 0 - Mild",
    "Level 1 - Moderate",
    "Level 2 - Severe",
    "Level 3 - Very Severe",
]

model = None

def load_model():
    global model
    if model is None:
        model = keras.models.load_model(MODEL_PATH)
    return model

def preprocess(image_bytes):
    img = tf.image.decode_image(image_bytes, channels=3, expand_animations=False)
    img = tf.image.resize(img, (IMG_SIZE, IMG_SIZE))
    return tf.expand_dims(img, axis=0)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    file = request.files["image"]
    image_bytes = file.read()
    m = load_model()
    probs = m.predict(preprocess(image_bytes), verbose=0)[0]
    idx = int(np.argmax(probs))
    acne_detected = idx > 0
    return jsonify({
        "acneDetected": acne_detected,
        "acneLevel": LABELS[idx],
        "acneSeverityLevel": idx,
        "confidence": float(probs[idx])
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
