import express from "express";
import multer from "multer";
import {
  createReminder,
  downloadMaterial,
  postMaterial,
  getMaterials,
  postEvent,
  getAllNotifications,
  postAnnouncement,
} from "../controller/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const notificationRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// POST a reminder
notificationRouter.post("/reminder", authMiddleware, upload.single("image"), createReminder);

// POST material (lecturer only)
notificationRouter.post("/material", authMiddleware, upload.array("documents"), postMaterial);

// GET all materials
notificationRouter.get("/material", getMaterials);

// DOWNLOAD a material file
notificationRouter.get("/download-material", downloadMaterial);
notificationRouter.get("/", getAllNotifications);

// POST announcement (lecturer only)
notificationRouter.post(
  "/announcement",
  authMiddleware,
  upload.array("images"),
  postAnnouncement
);


// POST an event (lecturer only)
notificationRouter.post("/event", authMiddleware, upload.array("images"), postEvent);


export default notificationRouter;
