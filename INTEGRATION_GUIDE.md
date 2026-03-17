# Integration Guide: Python YOLOv8 Model to Another UI

This guide explains how to integrate the Road Damage Detection YOLOv8 model with another user interface (frontend framework).

## Current Architecture

```
Frontend (React)
    ↓
API Server (Express.js) - Port 5000
    ↓
Python Model (YOLOv8) - detect_image.py
    ↓
YOLOv8_Small_RDD.pt (Model Weights)
```

---

## Integration Steps

### Step 1: Set Up the Backend Server

The backend is an Express.js server that acts as a bridge between the frontend and Python model.

#### Requirements:
- Node.js installed
- Python 3.8+ with virtual environment
- Required Python packages (ultralytics, cv2, etc.)

#### Setup Backend:
```bash
cd api
npm install
npm start  # Server runs on http://localhost:5000
```

#### Required Files in `/api`:
- `server.js` - Express server with detection endpoint
- `../venv` - Python virtual environment with dependencies

---

### Step 2: Understand the API Endpoints

#### **POST /detect/image**
Sends an image for road damage detection.

**Request:**
```
Method: POST
URL: http://localhost:5000/detect/image
Content-Type: multipart/form-data

Body:
- image: (File) - Image to analyze
- threshold: (Number) - Confidence threshold (0.0-1.0)
```

**Response:**
```json
{
  "detections": [
    {
      "class_id": 0,
      "label": "Longitudinal Crack",
      "score": 0.95,
      "box": [x1, y1, x2, y2]
    }
  ],
  "output_image": "path/to/annotated/image.jpg",
  "input_image": "path/to/original/image.jpg",
  "model_name": "YOLOv8_Small_RDD",
  "threshold": 0.5
}
```

#### Detection Classes:
- Class 0: `Longitudinal Crack`
- Class 1: `Transverse Crack`
- Class 2: `Alligator Crack`
- Class 3: `Potholes`

---

### Step 3: Frontend Implementation Examples

#### **For Vue.js:**

```javascript
// services/detectionService.js
const API_BASE_URL = 'http://localhost:5000';

export const detectImageVue = async (imageFile, threshold = 0.5) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('threshold', threshold);

  const response = await fetch(`${API_BASE_URL}/detect/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Detection failed');
  return await response.json();
};
```

```vue
<!-- ImageDetection.vue -->
<template>
  <div class="detection-container">
    <input type="file" @change="handleFileSelect" accept="image/*">
    <button @click="runDetection" :disabled="!image">Detect</button>
    
    <div v-if="loading">Processing...</div>
    <div v-if="results">
      <img :src="results.output_image" alt="Result">
      <ul>
        <li v-for="detection in results.detections" :key="detection.class_id">
          {{ detection.label }}: {{ (detection.score * 100).toFixed(1) }}%
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { detectImageVue } from '@/services/detectionService';

export default {
  data() {
    return {
      image: null,
      results: null,
      loading: false,
    };
  },
  methods: {
    handleFileSelect(e) {
      this.image = e.target.files[0];
    },
    async runDetection() {
      this.loading = true;
      try {
        this.results = await detectImageVue(this.image);
      } catch (error) {
        alert('Detection failed: ' + error.message);
      }
      this.loading = false;
    }
  }
};
</script>
```

---

#### **For Angular:**

```typescript
// services/detection.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetectionService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  detectImage(imageFile: File, threshold: number = 0.5): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('threshold', threshold);

    return this.http.post(`${this.apiUrl}/detect/image`, formData);
  }
}
```

```typescript
// components/detection.component.ts
import { Component } from '@angular/core';
import { DetectionService } from '@/services/detection.service';

@Component({
  selector: 'app-detection',
  templateUrl: './detection.component.html',
})
export class DetectionComponent {
  selectedFile: File | null = null;
  results: any = null;
  loading = false;

  constructor(private detectionService: DetectionService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  runDetection() {
    if (!this.selectedFile) return;
    
    this.loading = true;
    this.detectionService.detectImage(this.selectedFile).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (error) => {
        alert('Detection failed: ' + error.message);
        this.loading = false;
      }
    });
  }
}
```

---

#### **For Flutter (Dart):**

```dart
// services/detection_service.dart
import 'package:http/http.dart' as http;
import 'dart:io';

class DetectionService {
  static const String apiUrl = 'http://localhost:5000';

  static Future<Map<String, dynamic>> detectImage(
    File imageFile,
    {double threshold = 0.5}
  ) async {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('$apiUrl/detect/image'),
    );

    request.files.add(
      await http.MultipartFile.fromPath('image', imageFile.path),
    );
    request.fields['threshold'] = threshold.toString();

    var response = await request.send();
    var responseData = await response.stream.bytesToString();

    if (response.statusCode == 200) {
      return jsonDecode(responseData);
    } else {
      throw Exception('Detection failed');
    }
  }
}
```

---

#### **For Python (Tkinter/PyQt):**

```python
# services/detection_service.py
import requests
import json

API_BASE_URL = 'http://localhost:5000'

def detect_image(image_path: str, threshold: float = 0.5) -> dict:
    """Send image to backend for detection"""
    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'threshold': threshold}
        
        response = requests.post(
            f'{API_BASE_URL}/detect/image',
            files=files,
            data=data
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f'Detection failed: {response.text}')
```

```python
# gui/detection_window.py
import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
from services.detection_service import detect_image

class DetectionApp:
    def __init__(self, root):
        self.root = root
        self.root.title('Road Damage Detection')
        self.image_path = None
        
        # File button
        tk.Button(root, text='Select Image', command=self.select_image).pack()
        
        # Detect button
        tk.Button(root, text='Detect', command=self.run_detection).pack()
        
        # Results label
        self.results_label = tk.Label(root, text='')
        self.results_label.pack()
    
    def select_image(self):
        self.image_path = filedialog.askopenfilename(
            filetypes=[('Image files', '*.jpg *.png')]
        )
    
    def run_detection(self):
        if not self.image_path:
            messagebox.showerror('Error', 'Please select an image')
            return
        
        try:
            results = detect_image(self.image_path)
            self.display_results(results)
        except Exception as e:
            messagebox.showerror('Error', str(e))
    
    def display_results(self, results):
        detection_text = '\n'.join([
            f"{d['label']}: {d['score']:.2%}"
            for d in results['detections']
        ])
        self.results_label.config(text=detection_text)
```

---

### Step 4: Environment Setup

#### Python Virtual Environment:
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install requirements
pip install ultralytics opencv-python numpy
```

#### Create `requirements.txt`:
```
ultralytics==8.0.x
opencv-python==4.8.x
numpy==1.24.x
torch==2.x  # (install separately if needed)
```

---

### Step 5: Deployment

#### **For Production:**

1. **Set up a proper backend server** (use Gunicorn/uWSGI for Python)
2. **Use environment variables** for paths and settings:
   ```bash
   export MODEL_PATH="/path/to/YOLOv8_Small_RDD.pt"
   export UPLOAD_DIR="/var/uploads"
   ```

3. **Add CORS handling** (already in current server.js)
4. **Use Docker** for containerization:

```dockerfile
# Dockerfile for backend
FROM node:18
WORKDIR /app

# Copy Node files
COPY api/ .
RUN npm install

# Install Python environment
RUN apt-get update && apt-get install -y python3 python3-pip
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy model and Python scripts
COPY python/ ./python/
COPY models/ ./models/

EXPOSE 5000
CMD ["npm", "start"]
```

---

### Step 6: Testing the Integration

#### Test endpoint with curl:
```bash
curl -X POST http://localhost:5000/detect/image \
  -F "image=@/path/to/image.jpg" \
  -F "threshold=0.5"
```

#### Test with Python:
```python
import requests

with open('test_image.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:5000/detect/image',
        files={'image': f},
        data={'threshold': 0.5}
    )
    print(response.json())
```

---

### Step 7: Common Issues & Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 already in use | Change port in server.js: `const port = 3001;` |
| Python not found | Update `pythonPath` in server.js to correct path |
| CORS errors | Ensure `cors()` middleware is enabled |
| Model not found | Verify `YOLOv8_Small_RDD.pt` exists in `/models` folder |
| Memory issues | Reduce image size or batch size |
| Slow inference | Use GPU (requires CUDA) instead of CPU |

---

### Step 8: Performance Optimization

```python
# Use GPU if available
import torch
device = "cuda" if torch.cuda.is_available() else "cpu"
model = YOLO('YOLOv8_Small_RDD.pt').to(device)

# Reduce image size for faster processing
import cv2
image = cv2.imread(image_path)
image = cv2.resize(image, (640, 480))  # Smaller size = faster

# Use half precision for faster inference
results = model.predict(image, half=True)
```

---

### Summary

To integrate the model with any other UI:

1. ✅ Keep the Express.js backend running
2. ✅ Make HTTP POST requests to `http://localhost:5000/detect/image`
3. ✅ Send image as multipart form-data
4. ✅ Parse JSON response with detections
5. ✅ Display results in your UI

The backend handles all Python/ML logic, so your frontend just needs to make API calls!
