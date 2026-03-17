const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
destination: (req, file, cb) => {
const uploadDir = path.join(__dirname, "../../uploads");


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

cb(null, uploadDir);


},

filename: (req, file, cb) => {
cb(null, Date.now() + path.extname(file.originalname));
}
});

// File size limit (10MB)
const upload = multer({
storage,
limits: { fileSize: 10 * 1024 * 1024 }
});

// Helper function to run Python script
const runPythonScript = (script, args) => {
return new Promise((resolve, reject) => {


const pythonPath = path.join(__dirname, "../../python", script);

const pythonProcess = spawn("python", [pythonPath, ...args]);

let stdout = "";
let stderr = "";

pythonProcess.stdout.on("data", (data) => {
  stdout += data.toString();
});

pythonProcess.stderr.on("data", (data) => {
  stderr += data.toString();
});

pythonProcess.on("close", (code) => {

  if (code === 0) {
    try {
      const result = JSON.parse(stdout.trim());
      resolve(result);
    } catch (error) {
      console.error("Python stdout:", stdout);
      console.error("Python stderr:", stderr);
      reject(new Error("Failed to parse Python output"));
    }
  } else {
    console.error("Python stderr:", stderr);
    reject(new Error("Python script failed: " + stderr));
  }

});


});
};

// Image detection route
router.post("/image", upload.single("image"), async (req, res) => {
try {


if (!req.file) {
  return res.status(400).json({ error: "No image file provided" });
}

const imagePath = req.file.path;
const threshold = req.body.threshold || 0.5;

const result = await runPythonScript("detect_image.py", [
  imagePath,
  threshold.toString()
]);

res.json({
  detections: result.detections,
  annotatedImage: result.output_image,
  inputImage: result.input_image,
  model: result.model_name,
  threshold: result.threshold
});

console.log({
  detections: result.detections,
  annotatedImage: result.output_image,
  inputImage: result.input_image,
  model: result.model_name,
  threshold: result.threshold
});


} catch (error) {
console.error("Image detection error:", error);
res.status(500).json({ error: error.message });
}
});

// Video detection route
router.post("/video", upload.single("video"), async (req, res) => {
try {


if (!req.file) {
  return res.status(400).json({ error: "No video file provided" });
}

res.json({
  message: "Video detection not implemented yet",
  videoPath: req.file.path
});


} catch (error) {
console.error("Video detection error:", error);
res.status(500).json({ error: error.message });
}
});

// Realtime detection route
router.post("/realtime", upload.single("frame"), async (req, res) => {
try {


if (!req.file) {
  return res.status(400).json({ error: "No frame provided" });
}

const framePath = req.file.path;
const threshold = req.body.threshold || 0.5;

const result = await runPythonScript("detect_image.py", [
  framePath,
  threshold.toString()
]);

if (fs.existsSync(framePath)) {
  fs.unlinkSync(framePath);
}

res.json({
  detections: result.detections,
  frameProcessed: true
});


} catch (error) {
console.error("Realtime detection error:", error);
res.status(500).json({ error: error.message });
}
});

// STUN server route
router.get("/stun", async (req, res) => {
try {


const result = await runPythonScript("get_stun_server.py", []);

res.json({
  stunServer: result.stun
});


} catch (error) {
console.error("STUN server error:", error);
res.status(500).json({ error: error.message });
}
});

module.exports = router;
