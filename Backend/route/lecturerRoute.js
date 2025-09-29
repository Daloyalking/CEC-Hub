import express from "express";
import multer from "multer";
import {
  getLecturers,
  addLecturer,
  deleteLecturer,
} from "../controller/lecturerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const lecturerRouter = express.Router();

// ✅ Multer setup (memory storage, no disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
lecturerRouter.get("/", getLecturers); // Public
lecturerRouter.post("/", authMiddleware, upload.single("photo"), addLecturer); // HOD only
lecturerRouter.delete("/:id",deleteLecturer); 

export default lecturerRouter;
