from ultralytics import YOLO

model = YOLO("../models/YOLOv8_Small_RDD.pt")  # adjust path if needed
print(model.names)