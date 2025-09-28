import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import nodemailer from "nodemailer";
import { cloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier";

// Cloudinary helper
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --------------------- SIGNUP ---------------------
export const signUp = async (req, res) => {
  try {
    const { role, position, name, email, phone, matric, level, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { matric }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let pictureUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "users");
      pictureUrl = result.secure_url;
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
      picture: pictureUrl,
    });

    await newUser.save();

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
};

// --------------------- LOGIN ---------------------
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }, { matric: identifier }],
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect Password" });

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

// --------------------- GET USERS ---------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

// --------------------- EDIT PROFILE ---------------------
export const editProfile = async (req, res) => {
  try {
    const { name, email, phone, matric, level } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (user.role === "student") {
      user.matric = matric || user.matric;
      user.level = level || user.level;
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "users");
      user.picture = result.secure_url;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

// --------------------- CHANGE PASSWORD ---------------------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
};

// --------------------- PASSWORD RESET REQUEST ---------------------
export const requestPasswordReset = async (req, res) => {
  try {
    const { identifier } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }, { matric: identifier }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "mySuperSecretKey",
      { expiresIn: "15m" }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    if (!transporter.options.auth.user || !transporter.options.auth.pass) {
      return res.status(500).json({ message: "SMTP credentials are missing" });
    }

    const resetLink = `https://cechub.netlify.app/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: transporter.options.auth.user,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Hi ${user.name},</p>
             <p>Click below to reset your password (expires in 15 minutes):</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset link", error: err.message });
  }
};

// --------------------- RESET PASSWORD ---------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "mySuperSecretKey");
    } catch (err) {
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    const user = await User.findOne({
      _id: payload.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token invalid or expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset password", error: err.message });
  }
};
