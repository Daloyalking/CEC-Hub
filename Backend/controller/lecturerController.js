import Lecturer from "../model/Lecturer.js";
import { cloudinary } from "../config/cloudinary.js";

// ✅ Helper: upload one file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "lecturers") => {
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

// ✅ Get all lecturers (public)
export const getLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.find().sort({ createdAt: -1 });
    res.status(200).json(lecturers);
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Add lecturer (HOD only)
export const addLecturer = async (req, res) => {
  try {
    if (!req.user || req.user.position !== "hod") {
      return res.status(403).json({ message: "Access denied: HODs only" });
    }

    const { name, hod } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: "Name and photo are required" });
    }

    // Upload image to Cloudinary
    const photoUrl = await uploadToCloudinary(req.file.buffer);

    // Save to DB
    const newLecturer = new Lecturer({
      name,
      hod: hod || false,
      photo: photoUrl,
    });

    await newLecturer.save();

    res.status(201).json({
      message: "Lecturer added successfully",
      lecturer: newLecturer,
    });
  } catch (error) {
    console.error("Error adding lecturer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete lecturer (HOD only)
export const deleteLecturer = async (req, res) => {
  try {
    if (!req.user || req.user.position !== "hod") {
      return res.status(403).json({ message: "Access denied: HODs only" });
    }

    const lecturer = await Lecturer.findByIdAndDelete(req.params.id);
    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" });
    }

    res.json({ message: `${lecturer.name} has been removed.` });
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
