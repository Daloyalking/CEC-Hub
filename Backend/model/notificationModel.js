// models/notificationModel.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// Sub-schema for images (for events)
const imageSchema = new Schema({
  url: { type: String, required: true },
  description: { type: String },
});

// Sub-schema for documents (for materials)
const documentSchema = new Schema({
  url: { type: String },          // optional, Cloudinary secure URL
  public_id: { type: String, required: true }, // Cloudinary public_id
  name: { type: String, required: true },      // original filename with extension
  description: { type: String },
});

// Sub-schema for postedBy
const postedBySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
});

// Main Notification Schema
const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["event", "reminder", "material", "announcement"],
      required: true,
    },
    title: { type: String, required: true },
    details: { type: String, required: true },

    // Optional depending on type
    images: [imageSchema],      // for events
    documents: [documentSchema], // for materials
    level: { type: String },    // for reminders/materials

    postedBy: { type: postedBySchema, required: true },

    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
