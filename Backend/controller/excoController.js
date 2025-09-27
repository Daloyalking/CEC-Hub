import Exco from "../model/Exco.js";
import { v2 as cloudinary } from "cloudinary";

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

    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "excos",
      resource_type: "image",
    });

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

