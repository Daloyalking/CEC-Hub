import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { DeptContext } from "../context/DeptContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const PostProjectPage = () => {
  const { user, token } = useContext(AuthContext); // using JWT token
  const { projects, setProjects } = useContext(DeptContext);

  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Restrict to lecturers only
  if (!user) {
    return (
      <div className="p-8 text-center text-red-600">
        You must be logged in to post a project.
      </div>
    );
  }

  if (user.role !== "lecturer") {
    return (
      <div className="p-8 text-center text-red-600">
        Only lecturers can post past projects.
      </div>
    );
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const photoObjects = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      description: file.name,
    }));
    setPhotos(photoObjects);
  };

  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    toast.info("Photo removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic || !details) {
      toast.error("Topic and details are required!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("topic", topic);
      formData.append("details", details);
      formData.append("year", year);

      // Append photo files and descriptions
      photos.forEach((photo) => {
        formData.append("images", photo.file);
      });
      formData.append(
        "photosDescriptions",
        JSON.stringify(photos.map((p) => ({ description: p.description })))
      );

      const response = await axios.post(
        "cec-hub-qme6.vercel.app/api/project",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update global context with the new project
      setProjects([response.data.project, ...projects]);

      // Reset form
      setTopic("");
      setDetails("");
      setYear(new Date().getFullYear());
      setPhotos([]);

      toast.success("Project submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6">Post a New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Project Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter project topic"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Project Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter project details"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="2000"
            max={new Date().getFullYear()}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
            {photos.map((photo, idx) => (
              <div key={idx} className="relative border rounded overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.description}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Project"}
        </button>
      </form>
    </div>
  );
};

export default PostProjectPage;

