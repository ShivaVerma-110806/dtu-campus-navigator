import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/CategoryController.js";
import protect from "../middleware/ProtectedRoutes.js";

const router = express.Router();

// Publicly accessible to fetch category list
router.get("/all", getAllCategories);

// Protected routes (Admin-only actions verified inside controllers or middleware check)
router.post("/create", protect, createCategory);
router.put("/update/:id", protect, updateCategory);
router.delete("/delete/:id", protect, deleteCategory);

export default router;
