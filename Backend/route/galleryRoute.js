// routes/galleryRouter.js
import express from "express";
import multer from "multer";
import { createGallery, getGalleries, updateGallery } from "../controller/galleryController.js";

const galleryRouter = express.Router();

// Multer setup (memory storage, no disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
galleryRouter.post("/", upload.array("photos", 10), createGallery); // create
galleryRouter.get("/", getGalleries); // list

galleryRouter.patch("/:id", upload.array("photos", 10), updateGallery);

export default galleryRouter;
