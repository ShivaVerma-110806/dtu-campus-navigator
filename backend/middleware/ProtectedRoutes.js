import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // OR Get token from Cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // No Token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No token provided.",
      });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find User
    const user = await Users.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach User
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default protect;