import express from "express";
import {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
  searchLocations,
  getLocationBySlug
} from "../controllers/LocationController.js";

const router = express.Router();

router.post("/create", createLocation);
router.put("/update/:id", updateLocation);
router.delete("/delete/:id", deleteLocation);
router.get("/all", getAllLocations);
router.get("/search", searchLocations);
router.get("/slug/:slug", getLocationBySlug);

export default router;
