// models/projectModel.js
import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: { type: String, default: "No description" },
});

const conductedBySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  image: { type: String, default: "" },
});

const projectSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    details: { type: String, required: true },
    photos: [photoSchema],
    conductedBy: conductedBySchema,
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
