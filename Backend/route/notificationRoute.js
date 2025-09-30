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
  updateEvent,
  updateAnnouncement,
} from "../controller/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const notificationRouter = express.Router();

// ✅ Use memory storage (no local uploads folder)
const upload = multer({ storage: multer.memoryStorage() });

// POST a reminder
notificationRouter.post("/reminder", authMiddleware, upload.single("image"), createReminder);

// POST material (lecturer only)
notificationRouter.post("/material", authMiddleware, upload.array("documents"), postMaterial);

// GET all materials
notificationRouter.get("/material", getMaterials);

// DOWNLOAD a material file
notificationRouter.get("/download-material", downloadMaterial);

// GET all notifications
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

// UPDATE an event
notificationRouter.put(
  "/event/:id",
  authMiddleware,
  upload.array("images"),
  updateEvent
);

// UPDATE an announcement
notificationRouter.put(
  "/announcement/:id",
  authMiddleware,
  upload.array("images"),
  updateAnnouncement
);


export default notificationRouter;
