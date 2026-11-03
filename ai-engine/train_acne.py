"""
Flawless - Acne Severity Model: Training (standalone script)

Runs the full pipeline from start to finish:
  1. Download the ACNE04 dataset from Kaggle
  2. Split it into train / validation / test (70 / 15 / 15, stratified)
  3. Train MobileNetV2 (transfer learning), then fine-tune the last 40 layers
  4. Evaluate on the test set (classification report + confusion matrix)
  5. Save the trained model as acne_model_448.keras

Usage:
    pip install -r requirements.txt
    python train_acne.py

A GPU is strongly recommended (training on CPU will be very slow).
"""

import os

import kagglehub
import matplotlib
matplotlib.use("Agg")  # save plots to file, no window needed
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from sklearn.metrics import (ConfusionMatrixDisplay, classification_report,
                             confusion_matrix)
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from tensorflow import keras
from tensorflow.keras import layers

# ---------------------------------------------------------------
# Settings
# ---------------------------------------------------------------
IMG_SIZE = 448
BATCH = 16
SEED = 42
CLASSES = ["acne0_1024", "acne1_1024", "acne2_1024", "acne3_1024"]
LABELS = ["Level 0", "Level 1", "Level 2", "Level 3"]
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png")
OUTPUT_MODEL = "acne_model_448.keras"

tf.random.set_seed(SEED)
np.random.seed(SEED)


# ---------------------------------------------------------------
# 1. Download dataset
# ---------------------------------------------------------------
def download_dataset():
    path = kagglehub.dataset_download("manuelhettich/acne04")
    base = os.path.join(path, "acne_1024")
    print("Dataset location:", base)
    return base


# ---------------------------------------------------------------
# 2. Collect file paths and split
# ---------------------------------------------------------------
def collect_files(base):
    filepaths, labels = [], []
    for i, cls in enumerate(CLASSES):
        folder = os.path.join(base, cls)
        for f in os.listdir(folder):
            if f.lower().endswith(IMAGE_EXTENSIONS):
                filepaths.append(os.path.join(folder, f))
                labels.append(i)
    return filepaths, labels


def split_data(filepaths, labels):
    train_x, temp_x, train_y, temp_y = train_test_split(
        filepaths, labels, test_size=0.30, stratify=labels, random_state=SEED)
    val_x, test_x, val_y, test_y = train_test_split(
        temp_x, temp_y, test_size=0.50, stratify=temp_y, random_state=SEED)
    print(f"Train: {len(train_x)} | Val: {len(val_x)} | Test: {len(test_x)}")
    return train_x, train_y, val_x, val_y, test_x, test_y


# ---------------------------------------------------------------
# 3. tf.data pipelines
# ---------------------------------------------------------------
def load_image(img_path, label):
    img = tf.io.read_file(img_path)
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img = tf.image.resize(img, (IMG_SIZE, IMG_SIZE))
    return img, label


def make_ds(x, y, shuffle=False):
    ds = tf.data.Dataset.from_tensor_slices((x, y))
    if shuffle:
        ds = ds.shuffle(len(x), seed=SEED)
    ds = ds.map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
    return ds.batch(BATCH).prefetch(tf.data.AUTOTUNE)


# ---------------------------------------------------------------
# 4. Model
# ---------------------------------------------------------------
def build_model():
    augmentation = keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
        layers.RandomContrast(0.1),
    ], name="augmentation")

    base_model = keras.applications.MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = False

    inputs = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = augmentation(inputs)
    x = layers.Rescaling(1.0 / 127.5, offset=-1)(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(len(CLASSES), activation="softmax")(x)

    return keras.Model(inputs, outputs), base_model


def compile_model(model, lr):
    model.compile(
        optimizer=keras.optimizers.Adam(lr),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )


# ---------------------------------------------------------------
# 5. Evaluation
# ---------------------------------------------------------------
def evaluate(model, test_ds, test_y):
    y_pred = np.argmax(model.predict(test_ds), axis=1)
    y_true = np.array(test_y)

    print("\nTest set results:")
    print(classification_report(y_true, y_pred, target_names=LABELS))

    cm = confusion_matrix(y_true, y_pred)
    ConfusionMatrixDisplay(cm, display_labels=LABELS).plot(cmap="Purples")
    plt.title("Acne Severity - Confusion Matrix (Test Set)")
    plt.savefig("confusion_matrix.png", dpi=150, bbox_inches="tight")
    print("Confusion matrix saved to confusion_matrix.png")


# ---------------------------------------------------------------
# Main
# ---------------------------------------------------------------
def main():
    print("GPU available:", tf.config.list_physical_devices("GPU"))

    base = download_dataset()
    filepaths, labels = collect_files(base)
    train_x, train_y, val_x, val_y, test_x, test_y = split_data(filepaths, labels)

    train_ds = make_ds(train_x, train_y, shuffle=True)
    val_ds = make_ds(val_x, val_y)
    test_ds = make_ds(test_x, test_y)

    weights = compute_class_weight("balanced", classes=np.unique(train_y), y=train_y)
    class_weights = dict(enumerate(weights))
    print("Class weights:", {k: round(v, 2) for k, v in class_weights.items()})

    model, base_model = build_model()

    # Phase 1: train the new classification head only
    print("\nPhase 1: training the classification head")
    compile_model(model, 1e-3)
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=20,
        class_weight=class_weights,
        callbacks=[keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=4, restore_best_weights=True)],
    )

    # Phase 2: fine-tune the last 40 layers of MobileNetV2
    print("\nPhase 2: fine-tuning the last 40 layers")
    base_model.trainable = True
    for layer in base_model.layers[:-40]:
        layer.trainable = False
    compile_model(model, 1e-5)
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=30,
        class_weight=class_weights,
        callbacks=[keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=5, restore_best_weights=True)],
    )

    evaluate(model, test_ds, test_y)

    model.save(OUTPUT_MODEL)
    print(f"\nModel saved to {OUTPUT_MODEL}")


if __name__ == "__main__":
    main()
