import express from "express";
import multer from "multer";
import {
  getLecturers,
  addLecturer,
  deleteLecturer,
} from "../controller/lecturerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const storage = multer.memoryStorage(); // store in memory buffer
const upload = multer({ storage });

const lecturerRouter = express.Router();

// Public - get all lecturers
lecturerRouter.get("/", getLecturers);

// HOD only - add lecturer
lecturerRouter.post("/", authMiddleware, upload.single("photo"), addLecturer);

// HOD only - delete lecturer
lecturerRouter.delete("/:id", authMiddleware, deleteLecturer);

export default lecturerRouter;
