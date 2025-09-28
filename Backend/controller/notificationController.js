import transporter from "../config/nodemailer.js";
import Notification from "../model/notificationModel.js";
import User from "../model/userModel.js";
import { cloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier";
import path from "path";
import axios from "axios";

// ✅ Helper: upload buffer directly to Cloudinary
function uploadToCloudinary(buffer, folder, resource_type = "image", public_id = null) {
  return new Promise((resolve, reject) => {
    const options = { folder, resource_type };
    if (public_id) options.public_id = public_id;

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// 📌 GET all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 CREATE Reminder
export const createReminder = async (req, res) => {
  try {
    if (req.user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can send reminders" });
    }

    const { title, details, level } = req.body;
    if (!title || !details || !level) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const students = await User.find({ role: "student", level }).select("email");
    const studentEmails = students.map((s) => s.email);
    if (!studentEmails.length) {
      return res.status(404).json({ message: `No students found in ${level}` });
    }

    const notification = await Notification.create({
      type: "reminder",
      title,
      details,
      level,
      postedBy: { name: req.user.name, image: req.user.picture },
    });

    const mailOptions = {
      from: `"${req.user.name}" <${req.user.email}>`,
      to: studentEmails,
      subject: title,
      html: `<h2>${title}</h2>
             <p>${details}</p>
             <p><b>This reminder goes to all ${level} students.</b></p>
             <p>Sent by: ${req.user.name}<br/>Time: ${new Date().toLocaleString()}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Reminder sent successfully", notification });
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 POST Material
export const postMaterial = async (req, res) => {
  try {
    if (req.user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can post materials" });
    }

    const { title, details, level, descriptions } = req.body;
    if (!title || !details || !level) {
      return res.status(400).json({ message: "Title, details, and level are required" });
    }

    let parsedDescriptions = [];
    if (descriptions) {
      try {
        parsedDescriptions = JSON.parse(descriptions);
      } catch {
        return res.status(400).json({ message: "Invalid descriptions format" });
      }
    }

    const uploadedDocs = [];

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const ext = path.extname(file.originalname);
        const filename = path.basename(file.originalname, ext);

        const result = await uploadToCloudinary(
          file.buffer,
          "materials",
          "raw",
          `materials/${filename}_${Date.now()}`
        );

        uploadedDocs.push({
          url: result.secure_url,
          public_id: result.public_id,
          name: file.originalname,
          description: parsedDescriptions[i] || "No description",
        });
      }
    }

    const material = await Notification.create({
      type: "material",
      title,
      details,
      level,
      documents: uploadedDocs,
      postedBy: { name: req.user.name, image: req.user.picture },
    });

    const students =
      level === "All"
        ? await User.find({ role: "student" }).select("email")
        : await User.find({ role: "student", level }).select("email");

    const studentEmails = students.map((s) => s.email);

    if (studentEmails.length > 0) {
      const mailOptions = {
        from: `"${req.user.name}" <${req.user.email}>`,
        to: studentEmails,
        subject: `New Material: ${title}`,
        html: `<h2>${title}</h2>
               <p>${details}</p>
               <h3>Attached Documents:</h3>
               <ul>
                 ${uploadedDocs
                   .map(
                     (doc) =>
                       `<li><a href="http://localhost:4000/api/notification/download-material?id=${material._id}&doc=${encodeURIComponent(
                         doc.public_id
                       )}">${doc.name}</a></li>`
                   )
                   .join("")}
               </ul>
               <p>Sent by: ${req.user.name}<br/>Time: ${new Date().toLocaleString()}</p>`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: "Material posted successfully", material });
  } catch (error) {
    console.error("Error posting material:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 GET Materials
export const getMaterials = async (req, res) => {
  try {
    const materials = await Notification.find({ type: "material" })
      .sort({ createdAt: -1 })
      .populate("postedBy", "name picture");

    res.status(200).json({ materials });
  } catch (err) {
    console.error("Error fetching materials:", err);
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};

// 📌 DOWNLOAD Material
export const downloadMaterial = async (req, res) => {
  try {
    const { id, doc } = req.query;
    if (!id || !doc)
      return res.status(400).json({ message: "Missing material ID or document ID" });

    const material = await Notification.findById(id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    const cloudDoc = material.documents.find((d) => d.public_id === decodeURIComponent(doc));
    if (!cloudDoc) return res.status(404).json({ message: "Document not found in material" });

    const ext = cloudDoc.name.split(".").pop().toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === "pdf") contentType = "application/pdf";
    else if (ext === "docx")
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (ext === "doc") contentType = "application/msword";

    const response = await axios({ url: cloudDoc.url, method: "GET", responseType: "stream" });

    res.setHeader("Content-Disposition", `attachment; filename="${cloudDoc.name}"`);
    res.setHeader("Content-Type", contentType);

    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading material:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 POST Announcement
export const postAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can post announcements" });
    }

    const { title, details } = req.body;
    if (!title || !details) {
      return res.status(400).json({ message: "Title and details are required" });
    }

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      const descriptions = req.body.descriptions ? JSON.parse(req.body.descriptions) : [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await uploadToCloudinary(file.buffer, "announcements");

        uploadedImages.push({
          url: result.secure_url,
          description: descriptions[i] || "No description",
        });
      }
    }

    const announcement = await Notification.create({
      type: "announcement",
      title,
      details,
      images: uploadedImages,
      postedBy: { name: req.user.name, image: req.user.picture },
    });

    res.status(201).json({ message: "Announcement posted successfully", announcement });
  } catch (error) {
    console.error("Error posting announcement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 POST Event
export const postEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "You must be logged in" });
    }

    if (req.user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can post events" });
    }

    const { title, details } = req.body;
    if (!title || !details) {
      return res.status(400).json({ message: "Title and details are required" });
    }

    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      const descriptions = req.body.descriptions ? JSON.parse(req.body.descriptions) : [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await uploadToCloudinary(
          file.buffer,
          "events",
          "image",
          `events/${file.originalname}_${Date.now()}`
        );

        uploadedImages.push({
          url: result.secure_url,
          description: descriptions[i] || "No description",
        });
      }
    }

    const event = await Notification.create({
      type: "event",
      title,
      details,
      images: uploadedImages,
      postedBy: { name: req.user.name, image: req.user.picture },
    });

    res.status(201).json({ message: "Event posted successfully", event });
  } catch (error) {
    console.error("Error posting event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
