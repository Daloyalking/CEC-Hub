// AnnouncementPage.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AnnouncementPage = () => {
  const { user, token } = useContext(AuthContext); // logged-in user
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]); // {file, preview, description}
  const [posting, setPosting] = useState(false); // loading indicator

  // Handle image selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      description: "", // user will fill
    }));
    setImages([...images, ...newImages]);
  };

  // Handle image description change
  const handleDescriptionChange = (index, value) => {
    const newImages = [...images];
    newImages[index].description = value;
    setImages(newImages);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !details) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (!user || user.role !== "lecturer") {
      toast.error("Only lecturers can post announcements.");
      return;
    }

    setPosting(true); // start posting indicator

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("details", details);

      // Include descriptions array
      const descriptions = images.map((img) => img.description || "No description");
      formData.append("descriptions", JSON.stringify(descriptions));

      // Append image files
      images.forEach((img) => formData.append("images", img.file));

      const res = await axios.post(
        "https://cec-hub-qme6.vercel.app/api/notification/announcement",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Announcement posted successfully!");
      console.log("Posted announcement:", res.data.announcement);

      // Reset form
      setTitle("");
      setDetails("");
      setImages([]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to post announcement.");
    } finally {
      setPosting(false); // stop posting indicator
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <ToastContainer position="top-right" />
      <div className="w-full max-w-2xl p-8 bg-purple-50 rounded-3xl shadow-xl border border-purple-200">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Post an Announcement
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold text-purple-800">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter announcement title"
              required
              disabled={posting}
            />
          </div>

          {/* Details */}
          <div>
            <label className="block mb-2 font-semibold text-purple-800">Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              placeholder="Enter announcement details"
              rows={5}
              required
              disabled={posting}
            />
          </div>

          {/* Images */}
          <div>
            <label className="block mb-2 font-semibold text-purple-800">
              Upload Images (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={posting}
            />
          </div>

          {/* Preview of selected images */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {images.map((img, index) => (
                <div key={index} className="w-32">
                  <img
                    src={img.preview}
                    alt={`preview-${index}`}
                    className="w-32 h-32 object-cover rounded-lg border border-purple-300"
                  />
                  <input
                    type="text"
                    placeholder="Image description"
                    value={img.description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    className="mt-2 w-full p-1 rounded border border-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    disabled={posting}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="mt-1 w-full bg-red-500 text-white py-1 rounded text-xs hover:bg-red-600 transition"
                    disabled={posting}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-lg transition duration-200 shadow-md mt-4 ${
              posting ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-700"
            }`}
            disabled={posting}
          >
            {posting ? "Posting..." : "Post Announcement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementPage;
