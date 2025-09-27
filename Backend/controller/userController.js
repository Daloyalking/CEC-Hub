import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Multer setup for temporary storage
const upload = multer({ dest: "temp/" });

// Signup Controller
export const signUp = [
  upload.single("picture"), // middleware to handle file upload
  async (req, res) => {
    try {
      const { role, position, name, email, phone, matric, level, password } = req.body;

      console.log("REQ.BODY >>>", req.body);
      console.log("REQ.FILE >>>", req.file);

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }, { matric }],
      });
      if (existingUser) {
        // Delete uploaded file if exists
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Process picture if uploaded
      let picturePath = null;
      if (req.file) {
        const compressedPath = `uploads/${Date.now()}-${req.file.originalname}`;

        await sharp(req.file.path)
          .resize(200, 200) // resize to 200x200
          .jpeg({ quality: 50 }) // compress
          .toFile(compressedPath);

        fs.unlinkSync(req.file.path); // remove temp file
        picturePath = compressedPath;
      }

      const newUser = new User({
        role,
        position,
        name,
        email,
        phone,
        matric: role === "student" ? matric : "",
        level: role === "student" ? level : "",
        password: hashedPassword,
        picture: picturePath,
      });

      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET || "mySuperSecretKey",
        { expiresIn: "1d" }
      );

      res.status(201).json({ user: newUser, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Signup failed", error: error.message });
    }
  },
];

// Login Controller
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email, phone, or matric
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }, { matric: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// View all users controller
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password for security
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

export const editProfile = [
  upload.single("picture"),
  async (req, res) => {
    try {
      const { name, email, phone, matric, level } = req.body;
      const userId = req.user.id; // Set via auth middleware

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Update fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      if (user.role === "student") {
        user.matric = matric || user.matric;
        user.level = level || user.level;
      }

      // Handle picture upload
      if (req.file) {
        // Delete old picture if exists
        if (user.picture && fs.existsSync(user.picture)) {
          fs.unlinkSync(user.picture);
        }

        const compressedPath = `uploads/${Date.now()}-${req.file.originalname}`;
        await sharp(req.file.path)
          .resize(200, 200)
          .jpeg({ quality: 50 })
          .toFile(compressedPath);

        fs.unlinkSync(req.file.path); // delete temp file
        user.picture = compressedPath;
      }

      await user.save();

      res.status(200).json({ message: "Profile updated", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
  },
];

// CHANGE PASSWORD CONTROLLER
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
};