// controllers/galleryController.js
import Gallery from "../model/Gallery.js";
import { v2 as cloudinary } from "cloudinary";

// Create new gallery
export const createGallery = async (req, res) => {
  try {
    const { title, description, takenOn, category } = req.body;

    if (!title || !description || !takenOn || !category) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Helper: upload one file buffer to Cloudinary
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "gallery" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(fileBuffer);
      });
    };

    // Upload all images
    const photos = await Promise.all(
      req.files.map(async (file) => ({
        url: await uploadToCloudinary(file.buffer),
        description: file.originalname, // you can change this to accept captions from frontend
      }))
    );

    // Save gallery to DB
    const newGallery = new Gallery({
      title,
      description,
      photos,
      takenOn,
      category,
    });

    await newGallery.save();

    res.status(201).json({
      message: "Gallery created successfully",
      gallery: newGallery,
    });
  } catch (error) {
    console.error("Error creating gallery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all galleries
export const getGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
