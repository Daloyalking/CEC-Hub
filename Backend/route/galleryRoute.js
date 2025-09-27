// routes/galleryRoute.js
import express from "express";
import multer from "multer";
import { createGallery, getGalleries } from "../controller/galleryController.js";

const galleryRouter = express.Router();

// Multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
galleryRouter.post("/", upload.array("photos", 10), createGallery); // field name = "photos"
galleryRouter.get("/", getGalleries);

export default galleryRouter;
