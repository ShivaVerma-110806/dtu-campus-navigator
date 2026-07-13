import express from "express";
import { getSettings, updateSettings } from "../controllers/SettingsController.js";
import protect from "../middleware/ProtectedRoutes.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", protect, updateSettings);

export default router;
