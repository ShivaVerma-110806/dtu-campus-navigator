import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/ConnectDB.js";
import AuthRouter from "./routes/AuthRoutes.js";
import protect from "./middleware/ProtectedRoutes.js";
import LocationRouter from "./routes/LocationRoutes.js";
import CategoryRouter from "./routes/CategoryRoutes.js";
import SettingsRouter from "./routes/SettingsRoutes.js";
import MediaRouter from "./routes/MediaRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

//DB CONNECTION 
connectDB();

//ROUTES
app.use("/api/auth", AuthRouter);
app.use("/api/location", LocationRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/settings", SettingsRouter);
app.use("/api/media", MediaRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
