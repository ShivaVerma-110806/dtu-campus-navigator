import express from "express";
import {
  register,
  login,
  logout,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser
} from "../controllers/AuthController.js";
import protect from "../middleware/ProtectedRoutes.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);

// User administration routes
AuthRouter.get("/users", protect, getAllUsers);
AuthRouter.put("/users/:id/role", protect, updateUserRole);
AuthRouter.put("/users/:id/status", protect, updateUserStatus);
AuthRouter.delete("/users/:id", protect, deleteUser);

export default AuthRouter;
