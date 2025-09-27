import mongoose from "mongoose";

const LecturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hod: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Lecturer = mongoose.model("Lecturer", LecturerSchema);

export default Lecturer;
