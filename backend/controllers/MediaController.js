import multer from "multer";
import path from "path";
import fs from "fs";
import Media from "../models/Media.js";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "");
    cb(null, `${Date.now()}-${basename}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload file handler
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    // Resolve full path URL: e.g. http://localhost:5000/uploads/filename.png
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const media = await Media.create({
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
    res.status(201).json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Retrieve all uploaded media assets
export const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete media catalog item and local file on disk
export const deleteMedia = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can delete media" });
    }
    const { id } = req.params;
    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ success: false, message: "Media asset not found" });
    }

    const filePath = path.join(uploadDir, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Media.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
