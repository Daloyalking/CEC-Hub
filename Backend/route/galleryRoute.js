import express from "express";
import multer from "multer";
import { createGallery, getGalleries } from "../controller/galleryController.js";

const galleryRouter = express.Router();

// ✅ Multer setup (memory storage, no disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
galleryRouter.post("/", upload.array("photos", 10), createGallery); // "photos" = field name from frontend
galleryRouter.get("/", getGalleries);

export default galleryRouter;
