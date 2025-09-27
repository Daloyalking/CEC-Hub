import Project from "../model/projectModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// 📌 ADD Project (authenticated, only lecturers)
export const addProject = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "You must be logged in" });
    }

    // Optional: restrict to lecturers
    if (req.user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can add projects" });
    }

    const { topic, details, year, photos: photosData } = req.body;

    if (!topic || !details || !year) {
      return res.status(400).json({ message: "Topic, details, and year are required" });
    }

    let photos = [];

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const description =
          photosData && photosData[i] ? JSON.parse(photosData)[i].description : "No description";

        const result = await cloudinary.uploader.upload(file.path, {
          folder: "projects",
          use_filename: true,
          unique_filename: true,
          public_id: `projects/${file.originalname}_${Date.now()}`,
        });

        photos.push({
          url: result.secure_url,
          description,
        });

        // Remove local temp file
        fs.unlinkSync(file.path);
      }
    }

    const project = await Project.create({
      topic,
      details,
      year,
      photos,
      conductedBy: {
        name: req.user.name,
        designation: req.user.designation || "Lecturer",
        image: req.user.picture || "https://via.placeholder.com/50",
      },
    });

    res.status(201).json({ message: "Project added successfully", project });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 GET Projects (with offset & limit)
export const getProjects = async (req, res) => {
  try {
    let { offset = 0, limit = 10 } = req.query;
    offset = parseInt(offset);
    limit = parseInt(limit);

    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 GET Project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
