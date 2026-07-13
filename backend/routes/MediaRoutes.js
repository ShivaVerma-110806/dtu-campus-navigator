import express from "express";
import { upload, uploadFile, getAllMedia, deleteMedia } from "../controllers/MediaController.js";
import protect from "../middleware/ProtectedRoutes.js";

const router = express.Router();

router.get("/all", protect, getAllMedia);
router.post("/upload", protect, upload.single("file"), uploadFile);
router.delete("/delete/:id", protect, deleteMedia);

export default router;
