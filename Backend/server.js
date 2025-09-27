import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./route/userRoute.js";
import notificationRouter from "./route/notificationRoute.js";
import projectRouter from "./route/projectRoute.js";
import galleryRouter from "./route/galleryRoute.js";
import excoRouter from "./route/excoRoute.js";
import lecturerRouter from "./route/lecturerRoute.js";
import path from "path";
import { fileURLToPath } from "url";

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://foreverproject.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/user", userRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/project", projectRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/exco", excoRouter);
app.use("/api/lecturer", lecturerRouter);

// Test Route
app.get("/", (req, res) => {
  res.send("Server is working on Vercel!");
});

// Export the app for Vercel
export default app;
