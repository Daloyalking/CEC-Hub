import Gallery from "../model/Gallery.js";
import { cloudinary } from "../config/cloudinary.js";

// Helper: upload one file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "gallery") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

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

    // Upload all images in parallel
    const photos = await Promise.all(
      req.files.map(async (file) => ({
        url: await uploadToCloudinary(file.buffer),
        description: file.originalname, // you can replace with caption from frontend if needed
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

import Gallery from "../model/Gallery.js";
import { cloudinary } from "../config/cloudinary.js";

// Helper: upload one file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "gallery") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    stream.end(fileBuffer);
  });
};

// ✅ Create new gallery
export const createGallery = async (req, res) => {
  try {
    const { title, description, takenOn, category } = req.body;

    if (!title || !description || !takenOn || !category) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Upload all images in parallel
    const photos = await Promise.all(
      req.files.map(async (file) => await uploadToCloudinary(file.buffer))
    );

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

// ✅ Get all galleries
export const getGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update gallery (edit info + add new photos)
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, takenOn, category } = req.body;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // Update fields
    if (title) gallery.title = title;
    if (description) gallery.description = description;
    if (takenOn) gallery.takenOn = takenOn;
    if (category) gallery.category = category;

    // If new images uploaded, upload and add to photos
    if (req.files && req.files.length > 0) {
      const newPhotos = await Promise.all(
        req.files.map(async (file) => await uploadToCloudinary(file.buffer))
      );
      gallery.photos.push(...newPhotos);
    }

    await gallery.save();

    res.status(200).json({
      message: "Gallery updated successfully",
      gallery,
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete an image from Cloudinary and remove from gallery
export const deleteImage = async (req, res) => {
  try {
    const { galleryId, public_id } = req.body;

    if (!galleryId || !public_id) {
      return res.status(400).json({ message: "galleryId and public_id are required" });
    }

    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Remove from DB
    gallery.photos = gallery.photos.filter((photo) => photo.public_id !== public_id);
    await gallery.save();

    res.status(200).json({
      message: "Image deleted successfully",
      gallery,
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete gallery and its images
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // Delete images from Cloudinary
    await Promise.all(
      gallery.photos.map(async (photo) => {
        if (photo.public_id) {
          await cloudinary.uploader.destroy(photo.public_id);
        }
      })
    );

    await gallery.deleteOne();

    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
