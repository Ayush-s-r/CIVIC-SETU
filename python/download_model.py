import os
import requests

base_dir = os.path.dirname(os.path.dirname(__file__))
model_dir = os.path.join(base_dir, "models")
model_path = os.path.join(model_dir, "YOLOv8_Small_RDD.pt")

os.makedirs(model_dir, exist_ok=True)

url = "../models/YOLOv8_Small_RDD.pt"

print("Downloading model...")

response = requests.get(url)

if response.status_code == 200:
    with open(model_path, "wb") as f:
        f.write(response.content)

    print("✅ Model downloaded successfully")
else:
    raise Exception("❌ Model download failed")