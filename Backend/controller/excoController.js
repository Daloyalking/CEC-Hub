import Exco from "../model/Exco.js";
import { cloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier";

// Helper: upload buffer directly to Cloudinary
function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export const getExcos = async (req, res) => {
  try {
    const excos = await Exco.find().sort({ createdAt: -1 });
    res.json(excos);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addExco = async (req, res) => {
  try {
    const { name, post } = req.body;
    const file = req.file;

    if (!name || !post || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Upload buffer instead of local path
    const uploaded = await uploadToCloudinary(file.buffer, "excos");

    const newExco = new Exco({
      name,
      post,
      photo: uploaded.secure_url,
    });

    await newExco.save();
    res.status(201).json(newExco);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteExco = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Exco.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Exco not found" });
    }
    res.json({ message: `${deleted.name} removed successfully`, deleted });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
