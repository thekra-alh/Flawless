"""
Flawless - Acne Severity Prediction (standalone script)

Loads the trained model (acne_model_448.keras) and predicts the acne
severity level of one image or of every image inside a folder.

Usage:
    python predict_acne.py path/to/image.jpg
    python predict_acne.py path/to/folder

The model file must be in the same folder as this script.
"""

import os
import sys

import numpy as np
import tensorflow as tf
from tensorflow import keras

# ---------------------------------------------------------------
# Settings (must match the settings used during training)
# ---------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "acne_model_448.keras")
IMG_SIZE = 448

# ACNE04 severity levels (level 0 = lightest, level 3 = most severe)
LABELS = [
    "Level 0 - Mild",
    "Level 1 - Moderate",
    "Level 2 - Severe",
    "Level 3 - Very Severe",
]

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png")


def load_model(path=MODEL_PATH):
    """Load the trained Keras model from disk."""
    if not os.path.exists(path):
        sys.exit(f"Model file not found: {path}")
    return keras.models.load_model(path)


def preprocess(image_path):
    """Read an image and prepare it exactly like during training.

    The model already contains the rescaling layer, so the image is
    only resized here and kept in the 0-255 range.
    """
    img = tf.io.read_file(image_path)
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img = tf.image.resize(img, (IMG_SIZE, IMG_SIZE))
    return tf.expand_dims(img, axis=0)  # shape: (1, 448, 448, 3)


def predict(model, image_path):
    """Return the predicted level and the probability of every level."""
    probs = model.predict(preprocess(image_path), verbose=0)[0]
    idx = int(np.argmax(probs))
    return {
        "image": os.path.basename(image_path),
        "level": idx,
        "label": LABELS[idx],
        "confidence": float(probs[idx]),
        "probabilities": {LABELS[i]: float(p) for i, p in enumerate(probs)},
    }


def print_result(result):
    print(f"\nImage: {result['image']}")
    print(f"Prediction: {result['label']}  ({result['confidence']:.1%})")
    for label, p in result["probabilities"].items():
        print(f"    {label:<24} {p:.1%}")


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    target = sys.argv[1]
    if not os.path.exists(target):
        sys.exit(f"Path not found: {target}")

    model = load_model()

    if os.path.isdir(target):
        files = sorted(
            f for f in os.listdir(target) if f.lower().endswith(IMAGE_EXTENSIONS)
        )
        if not files:
            sys.exit("No images found in this folder.")
        for f in files:
            print_result(predict(model, os.path.join(target, f)))
    else:
        print_result(predict(model, target))


if __name__ == "__main__":
    main()
