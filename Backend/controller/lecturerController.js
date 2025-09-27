import Lecturer from "../model/Lecturer.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Get all lecturers (public)
export const getLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.find();
    res.json(lecturers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add lecturer (HOD only)
export const addLecturer = async (req, res) => {
  try {
    if (!req.user || !req.user.position) {
      return res.status(403).json({ message: "Access denied: HODs only" });
    }

    const { name, hod } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: "Name and photo are required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "lecturers" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: "Image upload failed" });

        const newLecturer = new Lecturer({
          name,
          hod: hod || false,
          photo: result.secure_url,
        });

        await newLecturer.save();
        return res.status(201).json(newLecturer);
      }
    );

    // Pipe the file buffer to Cloudinary
    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete lecturer (HOD only)
export const deleteLecturer = async (req, res) => {
  try {
    if (!req.user || !req.user.position) {
      return res.status(403).json({ message: "Access denied: HODs only" });
    }

    const lecturer = await Lecturer.findByIdAndDelete(req.params.id);
    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    res.json({ message: `${lecturer.name} has been removed.` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
