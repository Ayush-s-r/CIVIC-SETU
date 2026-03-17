import sys
import json
import cv2
from ultralytics import YOLO
import os
import numpy as np


def log(msg):
    print(msg, file=sys.stderr)


def enhance_image_for_detection(image):
    """Apply image enhancement to make potholes more visible"""
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)
    
    # Convert back to BGR
    enhanced_bgr = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)
    
    return enhanced_bgr


def detect_with_multiple_scales(image, model, threshold):
    """Try detection at multiple scales for better results"""
    all_detections = []
    scales = [0.5, 0.75, 1.0, 1.25, 1.5]  # Try different scales
    
    original_h, original_w = image.shape[:2]
    
    for scale in scales:
        if scale != 1.0:
            new_w = int(original_w * scale)
            new_h = int(original_h * scale)
            scaled_img = cv2.resize(image, (new_w, new_h))
        else:
            scaled_img = image
            
        # Run detection
        results = model.predict(
            source=scaled_img,
            conf=threshold,
            iou=0.5,
            imgsz=640,
            max_det=100,
            verbose=False
        )
        
        # Scale boxes back to original image size
        for result in results:
            if result.boxes is None:
                continue
                
            boxes = result.boxes.xyxy.cpu().numpy()
            scores = result.boxes.conf.cpu().numpy()
            classes = result.boxes.cls.cpu().numpy().astype(int)
            
            for i in range(len(boxes)):
                if scale != 1.0:
                    # Scale coordinates back to original
                    boxes[i][0] = boxes[i][0] / scale
                    boxes[i][1] = boxes[i][1] / scale
                    boxes[i][2] = boxes[i][2] / scale
                    boxes[i][3] = boxes[i][3] / scale
                
                all_detections.append({
                    "box": boxes[i].tolist(),
                    "score": float(scores[i]),
                    "class_id": int(classes[i]),
                    "scale": scale
                })
    
    return all_detections


def detect_image(image_path, threshold):
    log(f"Processing image: {image_path}")

    # Get the correct model path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "models", "YOLOv8_Small_RDD.pt")
    
    # Also try alternative paths
    if not os.path.exists(model_path):
        alt_path = os.path.join(os.path.dirname(script_dir), "models", "YOLOv8_Small_RDD.pt")
        if os.path.exists(alt_path):
            model_path = alt_path
        else:
            # Try current directory
            model_path = "YOLOv8_Small_RDD.pt"

    log(f"Looking for model at: {model_path}")

    if not os.path.exists(model_path):
        log(f"❌ Model not found at: {model_path}")
        # List files in models directory for debugging
        models_dir = os.path.join(script_dir, "models")
        if os.path.exists(models_dir):
            log(f"Files in models directory: {os.listdir(models_dir)}")
        return {"detections": [], "error": f"Model not found at {model_path}"}

    try:
        model = YOLO(model_path)
        log(f"✅ Model loaded successfully")
        log(f"Model classes: {model.names}")
    except Exception as e:
        log(f"❌ Error loading model: {str(e)}")
        return {"detections": [], "error": f"Model loading failed: {str(e)}"}

    # Read image
    image = cv2.imread(image_path)
    if image is None:
        log("❌ Image could not be loaded")
        return {"detections": [], "error": "Image could not be loaded"}

    log(f"✅ Image loaded successfully: {image.shape} (HxW: {image.shape[0]}x{image.shape[1]})")
    
    # Try multiple approaches
    all_detections = []
    
    # Approach 1: Standard detection
    log("Approach 1: Standard detection")
    results = model.predict(
        source=image,
        conf=threshold,
        iou=0.5,
        imgsz=640,
        max_det=100,
        verbose=False
    )
    
    for result in results:
        if result.boxes is not None:
            boxes = result.boxes.xyxy.cpu().numpy().astype(int)
            scores = result.boxes.conf.cpu().numpy()
            classes = result.boxes.cls.cpu().numpy().astype(int)
            
            for i in range(len(boxes)):
                all_detections.append({
                    "box": boxes[i].tolist(),
                    "score": float(scores[i]),
                    "class_id": int(classes[i]),
                    "method": "standard"
                })
    
    log(f"Standard detection found: {len(all_detections)} detections")
    
    # Approach 2: Try with image enhancement (if no detections)
    if len(all_detections) == 0:
        log("Approach 2: Enhanced image detection")
        enhanced_img = enhance_image_for_detection(image)
        
        results = model.predict(
            source=enhanced_img,
            conf=threshold,
            iou=0.5,
            imgsz=640,
            max_det=100,
            verbose=False
        )
        
        for result in results:
            if result.boxes is not None:
                boxes = result.boxes.xyxy.cpu().numpy().astype(int)
                scores = result.boxes.conf.cpu().numpy()
                classes = result.boxes.cls.cpu().numpy().astype(int)
                
                for i in range(len(boxes)):
                    all_detections.append({
                        "box": boxes[i].tolist(),
                        "score": float(scores[i]),
                        "class_id": int(classes[i]),
                        "method": "enhanced"
                    })
        
        log(f"Enhanced detection found: {len(all_detections)} detections")
    
    # Approach 3: Multi-scale detection (if still no detections)
    if len(all_detections) == 0:
        log("Approach 3: Multi-scale detection")
        multi_detections = detect_with_multiple_scales(image, model, threshold)
        all_detections.extend(multi_detections)
        log(f"Multi-scale detection found: {len(multi_detections)} detections")

    # Process detections
    detections = []
    merged_boxes = []
    
    for detection in all_detections:
        x1, y1, x2, y2 = detection["box"]
        
        # Convert to integers
        box = [int(x1), int(y1), int(x2), int(y2)]
        
        # Get label
        class_id = detection["class_id"]
        if class_id in model.names:
            label = model.names[class_id]
        else:
            label = f"Damage (Class {class_id})"
        
        detection_entry = {
            "class_id": class_id,
            "label": label,
            "score": detection["score"],
            "box": box,
            "method": detection.get("method", "multi-scale")
        }
        
        detections.append(detection_entry)
        merged_boxes.append(box)
        
        log(f"Detection: {label} at {box} with confidence {detection['score']:.3f}")

    # Create annotated image
    annotated = image.copy()
    
    # Draw individual detections
    colors = [(0, 255, 0), (255, 0, 0), (0, 0, 255), (255, 255, 0)]
    for i, d in enumerate(detections):
        x1, y1, x2, y2 = d["box"]
        color = colors[i % len(colors)]
        
        # Draw rectangle
        cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 3)
        
        # Add label with background
        label_text = f"{d['label']}: {d['score']:.2f}"
        (text_w, text_h), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        
        # Draw background rectangle for text
        cv2.rectangle(annotated, (x1, y1 - text_h - 10), (x1 + text_w, y1), color, -1)
        
        # Draw text
        cv2.putText(
            annotated,
            label_text,
            (x1, y1 - 5),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 0, 0),
            2
        )

    # Draw merged box if multiple detections
    if len(merged_boxes) > 1:
        x1 = min([b[0] for b in merged_boxes])
        y1 = min([b[1] for b in merged_boxes])
        x2 = max([b[2] for b in merged_boxes])
        y2 = max([b[3] for b in merged_boxes])
        
        # Draw merged box in red
        cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 0, 255), 2)
        
        # Add merged label
        merged_label = f"Merged Damage Area ({len(detections)} detections)"
        cv2.putText(
            annotated,
            merged_label,
            (x1, y1 - 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2
        )
        
        # Add merged detection to list
        detections.append({
            "class_id": -1,
            "label": "Merged Damage Area",
            "score": float(np.mean([d["score"] for d in detections])),
            "box": [int(x1), int(y1), int(x2), int(y2)],
            "individual_detections": len(detections),
            "method": "merged"
        })

    # Save annotated image
    output_path = image_path + "_result.jpg"
    cv2.imwrite(output_path, annotated)
    log(f"✅ Annotated image saved to: {output_path}")

    # Prepare result
    result = {
        "detections": detections,
        "output_image": output_path,
        "input_image": image_path,
        "model_name": "YOLOv8_Small_RDD",
        "threshold": float(threshold),
        "detection_count": len(detections),
        "total_raw_detections": len(all_detections)
    }
    
    if len(detections) == 0:
        result["message"] = "No damage detected. Try adjusting threshold or check image quality."
        # Save the original image for reference
        cv2.imwrite(image_path + "_processed.jpg", image)
        result["debug_image"] = image_path + "_processed.jpg"
    
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Image path required"}))
        sys.exit(1)

    image_path = sys.argv[1]
    # Use very low threshold to catch anything
    threshold = 0.2

    log(f"Starting detection with threshold: {threshold}")
    result = detect_image(image_path, threshold)
    
    # Pretty print the result
    print(json.dumps(result, indent=2))