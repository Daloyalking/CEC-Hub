import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import userRouter from "./route/userRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import notificationRouter from "./route/notificationRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import projectRouter from "./route/projectRoute.js";
import galleryRouter from "./route/galleryRoute.js";
import excoRouter from "./route/excoRoute.js";
import lecturerRouter from "./route/lecturerRoute.js";

// Get current file path
const __filename = fileURLToPath(import.meta.url);

// Get current directory
const __dirname = path.dirname(__filename);

//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary();

//Middleware
app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:5174", "https://foreverproject.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Api Endpoint
app.use("/api/user", userRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/project", projectRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/exco", excoRouter);
app.use("/api/lecturer", lecturerRouter);




app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(port, () => console.log(`Server started on port ${port}`));
