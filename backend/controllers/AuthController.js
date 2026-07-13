import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// ====================== REGISTER ======================

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(newUser);

    // Set Cookie (Recommended)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token, // Optional if using cookies
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isSuspended: newUser.isSuspended,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ====================== LOGIN ======================

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find User
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended by an administrator.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Generate JWT
    const token = generateToken(user);

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token, // Optional if using cookies
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSuspended: user.isSuspended,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== LOGOUT ======================

export const logout = (req, res) => {

  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });

};

// ====================== ADMIN USER MANAGEMENT ======================

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const users = await Users.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["admin", "student"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role value" });
    }
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.role = role;
    await user.save();
    res.status(200).json({ success: true, message: "User role updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const { id } = req.params;
    const { isSuspended } = req.body;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.isSuspended = isSuspended !== undefined ? isSuspended : !user.isSuspended;
    await user.save();
    res.status(200).json({ success: true, message: "User suspension state updated", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot delete your own account" });
    }
    const user = await Users.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};