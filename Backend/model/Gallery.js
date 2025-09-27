// models/Gallery.js
import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    photos: [photoSchema],
    takenOn: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Event",
        "Exhibition",
        "Lecture",
        "Lab Session",
        "Seminar",
        "Award",
        "Meeting",
        "Training",
        "Sports",
        "Workshop",
        "Competition",
        "Conference",
        "Retreat",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
