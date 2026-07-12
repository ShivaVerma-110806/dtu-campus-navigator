import express from "express";
import { register , login , logout } from "../controllers/AuthController.js";
const AuthRouter = express.Router();

// Register user
AuthRouter.post("/register", register);

// Login user
AuthRouter.post("/login", login);

// Logout user
AuthRouter.post("/logout", logout);

export default AuthRouter;
