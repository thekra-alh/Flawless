# AI Engine – Acne Severity Model

## Files

| File | What it is |
|---|---|
| `acne_model.ipynb` | Google Colab notebook used to **train** the model (data loading, splitting, training, evaluation). Needs Colab and must be run top to bottom. |
| `acne_model_448.keras` | The **trained model** itself (weights + architecture). Binary file, cannot be opened as text. |
| `predict_acne.py` | **Standalone script** that loads the trained model and predicts the acne level of new images. |
| `requirements.txt` | Python libraries needed to run the script. |

## Model summary

- Dataset: ACNE04 (watermark-free version on Kaggle, 1,377 images, 4 severity levels)
- Split: 70% train / 15% validation / 15% test (stratified)
- Architecture: MobileNetV2 (ImageNet weights) + transfer learning, fine-tuning of the last 40 layers
- Input size: 448 × 448
- Class weights used to handle class imbalance
- Test accuracy: **63%** | Macro F1: **0.64** (baseline at 224 × 224: 53%)

## How to test

```bash
pip install -r requirements.txt

# one image
python predict_acne.py test_image.jpg

# every image in a folder
python predict_acne.py test_images/
```

`acne_model_448.keras` must be in the same folder as `predict_acne.py`.

Example output:

```
Image: test_image.jpg
Prediction: Level 1 - Moderate  (71.4%)
    Level 0 - Mild           20.3%
    Level 1 - Moderate       71.4%
    Level 2 - Severe          7.1%
    Level 3 - Very Severe     1.2%
```
