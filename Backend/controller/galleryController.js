// controller/galleryController.js
import Gallery from "../model/Gallery.js";
import { cloudinary } from "../config/cloudinary.js";

/**
 * Helper: upload buffer to Cloudinary and return { url, public_id }
 */
const uploadToCloudinary = (fileBuffer, folder = "gallery") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Try to extract Cloudinary public_id from a secure URL.
 * This handles URLs like:
 *  https://res.cloudinary.com/<cloud_name>/image/upload/v1234567/folder/subfolder/name.jpg
 * Returns "folder/subfolder/name" (without extension) or null.
 */
const extractPublicIdFromUrl = (url) => {
  try {
    // match portion after /upload/ optionally skipping version /v123/
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i);
    if (match && match[1]) return match[1];
    return null;
  } catch (err) {
    return null;
  }
};

/**
 * Create new gallery
 */
export const createGallery = async (req, res) => {
  try {
    const { title, description, takenOn, category } = req.body;

    if (!title || !description || !takenOn || !category) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Upload all images in parallel and store url + public_id
    const photos = await Promise.all(
      req.files.map(async (file) => {
        const { url, public_id } = await uploadToCloudinary(file.buffer);
        return {
          url,
          public_id,
          description: file.originalname, // can be replaced with caption from frontend
        };
      })
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

/**
 * Get all galleries
 */
export const getGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update gallery (edit). Supports:
 *  - Updating title/description/takenOn/category (form fields)
 *  - Deleting existing photos: pass photosToDelete as JSON array (public_id OR url)
 *  - Uploading new photos via multipart/form-data field "photos"
 *
 * Expected request: multipart/form-data (when uploading new images)
 * photosToDelete should be a JSON array string (e.g. '["public_id1","https://.../file.jpg"]')
 */
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // Parse simple fields from req.body (multipart form fields are strings)
    const { title, description, takenOn, category } = req.body;

    // photosToDelete may arrive as:
    // - actual array (rare with multipart)
    // - JSON string (common when sending form-data)
    // - comma-separated string (fallback)
    let photosToDelete = req.body.photosToDelete;
    if (photosToDelete) {
      if (typeof photosToDelete === "string") {
        try {
          photosToDelete = JSON.parse(photosToDelete);
        } catch (err) {
          // fallback to comma-separated parsing
          photosToDelete = photosToDelete
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    } else {
      photosToDelete = [];
    }

    // Arrays to record successfully deleted identifiers so we can remove from DB
    const deletedPublicIds = [];
    const deletedUrls = [];

    if (Array.isArray(photosToDelete) && photosToDelete.length > 0) {
      await Promise.all(
        photosToDelete.map(async (identifier) => {
          try {
            // Try to find the photo object in the gallery by public_id or url
            const foundPhoto = gallery.photos.find(
              (p) => p.public_id === identifier || p.url === identifier
            );

            // Determine public_id to use for Cloudinary destroy:
            let publicId = foundPhoto?.public_id ?? null;
            if (!publicId) {
              // try to extract from identifier if it was a url or full path
              publicId = extractPublicIdFromUrl(identifier);
            }

            if (!publicId) {
              // Nothing we can do; log and skip
              console.warn("Could not determine public_id for delete identifier:", identifier);
              return;
            }

            // Attempt to delete from Cloudinary
            const destroyResult = await cloudinary.uploader.destroy(publicId, {
              resource_type: "image",
            });
            // destroyResult may be { result: "ok" } or "not found" or similar
            // We'll treat "ok" or "not found" as non-fatal and continue.

            // record what to remove from DB (both public_id and URL if we found a matching photo)
            deletedPublicIds.push(publicId);
            if (foundPhoto?.url) deletedUrls.push(foundPhoto.url);
          } catch (err) {
            console.error("Error deleting image from Cloudinary for identifier:", identifier, err);
            // continue with other deletions
          }
        })
      );
    }

    // Filter out deleted photos from gallery.photos
    if (deletedPublicIds.length > 0 || deletedUrls.length > 0) {
      gallery.photos = gallery.photos.filter((p) => {
        // keep photo if its public_id OR url is NOT in deleted lists
        const publicIdMatch = p.public_id && deletedPublicIds.includes(p.public_id);
        const urlMatch = p.url && deletedUrls.includes(p.url);
        return !(publicIdMatch || urlMatch);
      });
    }

    // Handle newly uploaded files (if any)
    if (req.files && req.files.length > 0) {
      const newPhotos = await Promise.all(
        req.files.map(async (file) => {
          const { url, public_id } = await uploadToCloudinary(file.buffer);
          return {
            url,
            public_id,
            description: file.originalname,
          };
        })
      );
      // append new photos
      gallery.photos.push(...newPhotos);
    }

    // Update other fields only if provided (so partial updates work)
    if (typeof title === "string" && title.trim() !== "") gallery.title = title;
    if (typeof description === "string" && description.trim() !== "") gallery.description = description;
    if (typeof takenOn === "string" && takenOn.trim() !== "") gallery.takenOn = takenOn;
    if (typeof category === "string" && category.trim() !== "") gallery.category = category;

    // Save updated gallery
    await gallery.save();

    return res.status(200).json({
      message: "Gallery updated successfully",
      gallery,
      deletedPublicIds,
      deletedUrls,
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
