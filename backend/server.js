import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/ConnectDB.js";
import AuthRouter from "./routes/AuthRoutes.js";
import protect from "./middleware/ProtectedRoutes.js";
import LocationRouter from "./routes/LocationRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
//MIDDLEWARE
app.use(express.json());
//DB CONNECTION 
connectDB();

//ROUTES
app.use("/api/auth", AuthRouter);
app.use("/api/location", LocationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
