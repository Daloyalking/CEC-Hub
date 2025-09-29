import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { DeptContext } from "../context/DeptContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AnnouncementPage = () => {
  const { user, token } = useContext(AuthContext);
  const { notification, addAnnouncement, updateAnnouncement, fetchNotifications } =
    useContext(DeptContext);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]); // {file, preview, description}
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch latest notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle edit button click
  const handleEdit = (ann) => {
    setTitle(ann.title);
    setDetails(ann.details);
    setImages(
      ann.images.map((img) => ({
        file: null,
        preview: img.url,
        description: img.description,
      }))
    );
    setEditingId(ann._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle image selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      description: "",
    }));
    setImages([...images, ...newImages]);
  };

  // Handle image description change
  const handleDescriptionChange = (index, value) => {
    const newImages = [...images];
    newImages[index].description = value;
    setImages(newImages);
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Submit new announcement or update existing one
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !details) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (!user || (user.role !== "lecturer" && !["President", "Public Relations Officer (PRO)"].includes(user.position))) {
  toast.error("You are not authorized to post or edit announcements.");
  return;
}

    setPosting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("details", details);

      // Add image descriptions
      const descriptions = images.map((img) => img.description || "No description");
      formData.append("descriptions", JSON.stringify(descriptions));

      // Add files if they exist
      images.forEach((img) => img.file && formData.append("images", img.file));

      if (editingId) {
        // Update existing announcement
        await updateAnnouncement(editingId, formData);
        toast.success("Announcement updated successfully!");
      } else {
        // Add new announcement
        await addAnnouncement(formData);
        toast.success("Announcement posted successfully!");
      }

      // Reset form
      setTitle("");
      setDetails("");
      setImages([]);
      setEditingId(null);

      fetchNotifications();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to post/update announcement.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <ToastContainer position="top-right" />
      <div className="w-full max-w-2xl mx-auto p-8 bg-purple-50 rounded-3xl shadow-xl border border-purple-200 mb-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          {editingId ? "Edit Announcement" : "Post an Announcement"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            disabled={posting}
            required
          />

          {/* Details */}
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Details"
            rows={5}
            className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            disabled={posting}
            required
          />

          {/* Images */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={posting}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Preview of images */}
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
            {posting ? (editingId ? "Updating..." : "Posting...") : editingId ? "Update Announcement" : "Post Announcement"}
          </button>
        </form>
      </div>

      {/* List of announcements */}
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {notification
          .filter((n) => n.type === "announcement")
          .map((ann) => (
            <div key={ann._id} className="p-4 border rounded-xl bg-purple-50 border-purple-200 shadow">
              <h2 className="font-bold text-lg text-purple-700">{ann.title}</h2>
              <p className="mt-2 text-gray-800">{ann.details}</p>
              {ann.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {ann.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={img.description || `image-${idx}`}
                      className="w-24 h-24 object-cover rounded-lg border border-purple-300"
                    />
                  ))}
                </div>
              )}
              {(user?.position === "President" ||
                user?.position === "Public Relations Officer (PRO)" ||
                user?.role === "lecturer") && (
                <button
                  onClick={() => handleEdit(ann)}
                  className="mt-3 bg-yellow-400 text-white py-1 px-3 rounded hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AnnouncementPage;
