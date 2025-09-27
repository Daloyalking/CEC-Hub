import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { DeptContext } from "../context/DeptContext";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const PostGalleryPage = () => {
  const { user } = useContext(AuthContext);
  const { setGallery } = useContext(DeptContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [takenOn, setTakenOn] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      description: "",
    }));
    setImages([...images, ...newImages]);
  };

  const handleImageDescriptionChange = (index, value) => {
    const updated = [...images];
    updated[index].description = value;
    setImages(updated);
  };

  const removeImage = (index) => {
    const updated = [...images];
    URL.revokeObjectURL(updated[index].url); 
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to post a gallery item.");
      return;
    }
    if (!title || !description || !category || images.length === 0) {
      toast.error("Please fill all fields and add at least one image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("takenOn", takenOn || new Date().toISOString().split("T")[0]);

      // Append images
      images.forEach((img) => {
        formData.append("photos", img.file);
        // If you want to also send per-image description to backend:
        // formData.append("photoDescriptions", img.description || "");
      });

      const res = await fetch("http://localhost:4000/api/gallery", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Gallery item posted successfully!");
        setGallery((prev) => [data.gallery, ...prev]);

        // Reset form
        setTitle("");
        setDescription("");
        setCategory("");
        setImages([]);
        setTakenOn("");
      } else {
        toast.error(data.message || "Failed to post gallery item");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while posting the gallery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="p-6 md:p-8 bg-purple-50 rounded-3xl shadow-xl border border-purple-200 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700 mb-6 text-center">
            Post a Gallery Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold text-purple-800">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Enter gallery title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold text-purple-800">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                placeholder="Enter gallery description"
                rows={3}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-semibold text-purple-800">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="">Select category</option>
                <option value="Event">Event</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Lecture">Lecture</option>
                <option value="Lab Session">Lab Session</option>
                <option value="Seminar">Seminar</option>
                <option value="Award">Award</option>
                <option value="Meeting">Meeting</option>
                <option value="Training">Training</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Conference">Conference</option>
                <option value="Retreat">Retreat</option>
              </select>
            </div>

            {/* Date Taken */}
            <div>
              <label className="block mb-2 font-semibold text-purple-800">Date Taken</label>
              <input
                type="date"
                value={takenOn}
                onChange={(e) => setTakenOn(e.target.value)}
                className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <p className="text-sm text-gray-600 mt-1">Leave empty to use today's date</p>
            </div>

            {/* Images Upload */}
            <div>
              <label className="block mb-2 font-semibold text-purple-800">Upload Images *</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <p className="text-sm text-gray-600 mt-1">Select one or multiple images</p>
            </div>

            {/* Preview */}
            {images.length > 0 && (
              <div className="space-y-4 mt-4">
                <h3 className="font-semibold text-purple-800">
                  Selected Images ({images.length})
                </h3>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="bg-purple-100 p-3 md:p-4 rounded-xl border border-purple-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src={img.url}
                          alt={`preview-${idx}`}
                          className="w-full md:w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium text-purple-700 mb-1">
                          Image Description
                        </label>
                        <input
                          type="text"
                          placeholder="Describe this image..."
                          value={img.description}
                          onChange={(e) =>
                            handleImageDescriptionChange(idx, e.target.value)
                          }
                          className="w-full p-2 md:p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm md:text-base"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="bg-red-500 text-white py-2 px-3 md:px-4 rounded-lg hover:bg-red-600 transition text-sm md:text-base whitespace-nowrap mt-2 md:mt-0 self-start"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-purple-700 transition duration-200 shadow-md mt-4 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Gallery Item"}
            </button>
          </form>
        </div>
      </div>

      {/* Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default PostGalleryPage;
