// AnnouncementPage.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "../context/AuthContext";
import { DeptContext } from "../context/DeptContext";

// This component integrates with your backend endpoints:
// POST   /api/notification/announcement
// PUT    /api/notification/announcement/:id
// GET    /api/notification
// It uses DeptContext when available, and falls back to a local fetch if not.

export default function AnnouncementPage() {
  const { user, token } = useContext(AuthContext) || {};
  const dept = useContext(DeptContext) || {};
  const { notification = [], fetchNotifications, setNotification } = dept;

  // Local fallback notifications (used when DeptContext doesn't expose fetchNotifications)
  const [localNotifications, setLocalNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // New announcement state
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]); // [{ file, preview, description }]
  const [posting, setPosting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editNewImages, setEditNewImages] = useState([]); // [{ file, preview, description }]
  const [editing, setEditing] = useState(false);

  // Refs to keep track of created object URLs so we can revoke them later
  const objectUrlsRef = useRef([]);

  // Derived announcements (prefer DeptContext's notification if available)
  const allNotifications = (Array.isArray(notification) && notification.length) ? notification : localNotifications;
  const announcements = allNotifications.filter((n) => n.type === "announcement");

  // Permission check - matches your backend logic: only lecturers OR President OR PRO
  const canPostOrEdit = !!user && (
    user.role === "lecturer" ||
    user.position === "President" ||
    user.position === "Public Relations Officer (PRO)"
  );

  // Fetch notifications: prefer DeptContext.fetchNotifications if provided
  useEffect(() => {
    let canceled = false;
    const load = async () => {
      setLoading(true);
      try {
        if (typeof fetchNotifications === "function") {
          await fetchNotifications();
        } else {
          const res = await axios.get("https://cec-hub-qme6.vercel.app/api/notification");
          if (!canceled) setLocalNotifications(res.data.notifications || []);
          // If DeptContext exposes setNotification, keep it in sync
          if (typeof setNotification === "function") {
            setNotification(res.data.notifications || []);
          }
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
        toast.error("Failed to load notifications");
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    load();

    return () => {
      canceled = true;
    };
  }, [fetchNotifications, setNotification]);

  // Cleanup created object URLs when component unmounts
  useEffect(() => {
    return () => {
      (objectUrlsRef.current || []).forEach((u) => URL.revokeObjectURL(u));
      objectUrlsRef.current = [];
    };
  }, []);

  // Utility: create preview objects from FileList
  const filesToPreviewObjects = (files) => {
    const arr = Array.from(files || []).map((file) => {
      const preview = URL.createObjectURL(file);
      objectUrlsRef.current.push(preview);
      return { file, preview, description: "" };
    });
    return arr;
  };

  // --- New announcement handlers ---
  const handleFileChange = (e) => {
    const added = filesToPreviewObjects(e.target.files);
    setImages((prev) => [...prev, ...added]);
    // reset input value so selecting same file again works if needed
    e.target.value = null;
  };

  const handleImageDescriptionChange = (idx, value) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], description: value };
      return copy;
    });
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => {
      const copy = [...prev];
      const removed = copy.splice(idx, 1)[0];
      if (removed && removed.preview) {
        try { URL.revokeObjectURL(removed.preview); } catch (e) {}
        objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== removed.preview);
      }
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canPostOrEdit) {
      toast.error("You don't have permission to post announcements.");
      return;
    }
    if (!title || !details) {
      toast.error("Please fill title and details");
      return;
    }

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("details", details);

      const descriptions = images.map((i) => i.description || "No description");
      formData.append("descriptions", JSON.stringify(descriptions));

      images.forEach((img) => formData.append("images", img.file));

      await axios.post(
        "https://cec-hub-qme6.vercel.app/api/notification/announcement",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // NOTE: browser will set Content-Type with proper boundary for FormData
          },
          withCredentials: true,
        }
      );

      toast.success("Announcement posted successfully");

      // refresh notifications
      if (typeof fetchNotifications === "function") await fetchNotifications();
      else {
        const res = await axios.get("https://cec-hub-qme6.vercel.app/api/notification");
        setLocalNotifications(res.data.notifications || []);
        if (typeof setNotification === "function") setNotification(res.data.notifications || []);
      }

      // reset form
      setTitle("");
      setDetails("");
      // revoke previews
      images.forEach((i) => { try { URL.revokeObjectURL(i.preview); } catch (e) {} });
      objectUrlsRef.current = [];
      setImages([]);

    } catch (err) {
      console.error("Failed to post announcement:", err);
      toast.error(err.response?.data?.message || "Failed to post announcement");
    } finally {
      setPosting(false);
    }
  };

  // --- Edit handlers ---
  const openEdit = (ann) => {
    setEditingId(ann._id);
    setEditTitle(ann.title || "");
    setEditDetails(ann.details || "");
    setEditNewImages([]);
    // scroll to top so edit form is visible
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditFileChange = (e) => {
    const added = filesToPreviewObjects(e.target.files);
    setEditNewImages((prev) => [...prev, ...added]);
    e.target.value = null;
  };

  const handleEditNewDescriptionChange = (idx, value) => {
    setEditNewImages((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], description: value };
      return copy;
    });
  };

  const handleRemoveEditNewImage = (idx) => {
    setEditNewImages((prev) => {
      const copy = [...prev];
      const removed = copy.splice(idx, 1)[0];
      if (removed && removed.preview) {
        try { URL.revokeObjectURL(removed.preview); } catch (e) {}
        objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== removed.preview);
      }
      return copy;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!canPostOrEdit) {
      toast.error("You don't have permission to edit announcements.");
      return;
    }
    if (!editingId) {
      toast.error("No announcement selected to edit.");
      return;
    }

    setEditing(true);
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("details", editDetails);

      const descriptions = editNewImages.map((i) => i.description || "No description");
      formData.append("descriptions", JSON.stringify(descriptions));
      editNewImages.forEach((img) => formData.append("images", img.file));

      await axios.put(
        `http://localhost:4000/api/notification/announcement/${editingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Announcement updated successfully");

      // refresh list
      if (typeof fetchNotifications === "function") await fetchNotifications();
      else {
        const res = await axios.get("https://cec-hub-qme6.vercel.app/api/notification");
        setLocalNotifications(res.data.notifications || []);
        if (typeof setNotification === "function") setNotification(res.data.notifications || []);
      }

      // reset edit form
      editNewImages.forEach((i) => { try { URL.revokeObjectURL(i.preview); } catch (e) {} });
      objectUrlsRef.current = objectUrlsRef.current.filter((u) => !editNewImages.find((ei) => ei.preview === u));
      setEditNewImages([]);
      setEditingId(null);
      setEditTitle("");
      setEditDetails("");

    } catch (err) {
      console.error("Failed to update announcement:", err);
      toast.error(err.response?.data?.message || "Failed to update announcement");
    } finally {
      setEditing(false);
    }
  };

  const cancelEdit = () => {
    // revoke edit previews
    editNewImages.forEach((i) => { try { URL.revokeObjectURL(i.preview); } catch (e) {} });
    objectUrlsRef.current = objectUrlsRef.current.filter((u) => !editNewImages.find((ei) => ei.preview === u));
    setEditNewImages([]);
    setEditingId(null);
    setEditTitle("");
    setEditDetails("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" />
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Post new announcement */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post an Announcement</h2>

          {!canPostOrEdit && (
            <p className="text-sm text-red-600 mb-3">Only lecturers or users with position 'President' or 'Public Relations Officer (PRO)' can post announcements.</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Announcement title"
                required
                disabled={!canPostOrEdit || posting}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Details</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                placeholder="Details"
                required
                disabled={!canPostOrEdit || posting}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Images (optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={!canPostOrEdit || posting}
                className="w-full"
              />
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-3">
                {images.map((img, idx) => (
                  <div key={idx} className="w-36">
                    <img src={img.preview} alt={`preview-${idx}`} className="w-36 h-36 object-cover rounded-lg border" />
                    <input
                      type="text"
                      value={img.description}
                      onChange={(e) => handleImageDescriptionChange(idx, e.target.value)}
                      placeholder="Image description"
                      className="mt-2 w-full p-1 rounded border text-sm"
                      disabled={posting}
                    />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="mt-1 w-full bg-red-500 text-white py-1 rounded text-xs">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={!canPostOrEdit || posting}
                className={`w-full py-3 rounded-xl font-bold text-white ${posting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {posting ? 'Posting...' : 'Post Announcement'}
              </button>
            </div>
          </form>
        </div>

        {/* Edit panel */}
        {editingId && (
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Edit Announcement</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300"
                  required
                  disabled={!canPostOrEdit || editing}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Details</label>
                <textarea
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-xl border border-gray-300 resize-none"
                  required
                  disabled={!canPostOrEdit || editing}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Add New Images (these will be appended)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditFileChange}
                  disabled={!canPostOrEdit || editing}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">Note: existing images are preserved. To remove existing images you must implement a backend endpoint to delete images from Cloudinary and remove them from the announcement.</p>
              </div>

              {editNewImages.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-3">
                  {editNewImages.map((img, idx) => (
                    <div key={idx} className="w-36">
                      <img src={img.preview} alt={`edit-preview-${idx}`} className="w-36 h-36 object-cover rounded-lg border" />
                      <input
                        type="text"
                        value={img.description}
                        onChange={(e) => handleEditNewDescriptionChange(idx, e.target.value)}
                        placeholder="Image description"
                        className="mt-2 w-full p-1 rounded border text-sm"
                        disabled={editing}
                      />
                      <button type="button" onClick={() => handleRemoveEditNewImage(idx)} className="mt-1 w-full bg-red-500 text-white py-1 rounded text-xs">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button type="submit" disabled={!canPostOrEdit || editing} className={`px-6 py-2 rounded-xl font-semibold text-white ${editing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
                  {editing ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={cancelEdit} disabled={editing} className="px-6 py-2 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Announcements list */}
        <div className="space-y-6">
          {loading && <p className="text-center text-gray-600">Loading announcements...</p>}
          {!loading && announcements.length === 0 && <p className="text-center text-gray-600">No announcements found.</p>}

          {announcements.map((ann) => (
            <div key={ann._id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{ann.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">Posted by: {ann.postedBy?.name || 'Unknown'} • {new Date(ann.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {canPostOrEdit && (
                    <button onClick={() => openEdit(ann)} className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600">Edit</button>
                  )}
                </div>
              </div>

              <div className="mt-3 text-gray-700 whitespace-pre-wrap">{ann.details}</div>

              {ann.images && ann.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ann.images.map((img, i) => (
                    <div key={i} className="rounded overflow-hidden border">
                      <img src={img.url} alt={img.description || `announcement-img-${i}`} className="w-full h-40 object-cover" />
                      {img.description && <div className="p-2 text-sm text-gray-600">{img.description}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
