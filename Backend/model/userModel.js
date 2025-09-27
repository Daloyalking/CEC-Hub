// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["student", "lecturer"],
      required: true,
      default: "student",
    },
    position: {
      type: String,
      default: "other", // Exco position or HOD/Others for lecturer
    },
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    matric: {
      type: String,
      default: "", // Only required if role === "student"
    },
    level: {
      type: String,
      enum: ["ND1", "ND2", "HND1", "HND2", ""],
      default: "",
    },
    picture: {
      type: String, // Store image URL or Base64 string
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Optional: Ensure matric is required only for students
userSchema.pre("validate", function (next) {
  if (this.role === "student" && !this.matric) {
    this.invalidate("matric", "Matric number is required for students");
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
