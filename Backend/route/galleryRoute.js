import express from "express";
import multer from "multer";
import {
  createGallery,
  getGalleries,
  updateGallery,
  deleteImage,
  deleteGallery,
} from "../controller/galleryController.js";

const galleryRouter = express.Router();

// ✅ Multer setup (memory storage, no disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
galleryRouter.post("/", upload.array("photos", 10), createGallery);
galleryRouter.get("/", getGalleries);
galleryRouter.put("/:id", upload.array("photos", 10), updateGallery);
galleryRouter.delete("/image", deleteImage); // expects {galleryId, public_id}
galleryRouter.delete("/:id", deleteGallery);

export default galleryRouter;
