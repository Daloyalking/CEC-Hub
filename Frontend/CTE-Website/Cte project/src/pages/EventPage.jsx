


import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "../context/AuthContext";
import { DeptContext } from "../context/DeptContext";

// This integrates with backend endpoints:
// POST   /api/notification/event
// PUT    /api/notification/event/:id
// GET    /api/notification
// Works with DeptContext or local state as fallback.

export default function EventPage() {
  const { user, token } = useContext(AuthContext) || {};
  const dept = useContext(DeptContext) || {};
  const { notification = [], fetchNotifications, setNotification } = dept;

  const [localNotifications, setLocalNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // New event state
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState([]);
  const [posting, setPosting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editNewImages, setEditNewImages] = useState([]);
  const [editing, setEditing] = useState(false);

  const objectUrlsRef = useRef([]);

  // Derived list
  const allNotifications =
    Array.isArray(notification) && notification.length
      ? notification
      : localNotifications;
  const events = allNotifications.filter((n) => n.type === "event");

  // Restrict posting/editing
  const canPostOrEdit =
    !!user &&
    (user.role === "lecturer" ||
      user.position === "President" ||
      user.position === "Public Relations Officer (PRO)");

  // Fetch events
  useEffect(() => {
    let canceled = false;
    const load = async () => {
      setLoading(true);
      try {
        if (typeof fetchNotifications === "function") {
          await fetchNotifications();
        } else {
          const res = await axios.get(
            "https://cec-hub-qme6.vercel.app/api/notification"
          );
          if (!canceled) setLocalNotifications(res.data.notifications || []);
          if (typeof setNotification === "function") {
            setNotification(res.data.notifications || []);
          }
        }
      } catch (err) {
        console.error("Failed to load events:", err);
        toast.error("Failed to load events");
      } finally {
        if (!canceled) setLoading(false);
      }
    };
    load();
    return () => {
      canceled = true;
    };
  }, [fetchNotifications, setNotification]);

  // Cleanup URLs
  useEffect(() => {
    return () => {
      (objectUrlsRef.current || []).forEach((u) => URL.revokeObjectURL(u));
      objectUrlsRef.current = [];
    };
  }, []);

  // Helpers
  const filesToPreviewObjects = (files) =>
    Array.from(files || []).map((file) => {
      const preview = URL.createObjectURL(file);
      objectUrlsRef.current.push(preview);
      return { file, preview, description: "" };
    });

  // New event
  const handleFileChange = (e) => {
    const added = filesToPreviewObjects(e.target.files);
    setImages((prev) => [...prev, ...added]);
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
      if (removed?.preview) {
        try {
          URL.revokeObjectURL(removed.preview);
        } catch {}
        objectUrlsRef.current = objectUrlsRef.current.filter(
          (u) => u !== removed.preview
        );
      }
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canPostOrEdit) {
      toast.error("You don't have permission to post events.");
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
        "https://cec-hub-qme6.vercel.app/api/notification/event",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Event posted successfully");

      if (typeof fetchNotifications === "function") await fetchNotifications();
      else {
        const res = await axios.get(
          "https://cec-hub-qme6.vercel.app/api/notification"
        );
        setLocalNotifications(res.data.notifications || []);
        if (typeof setNotification === "function")
          setNotification(res.data.notifications || []);
      }

      setTitle("");
      setDetails("");
      images.forEach((i) => {
        try {
          URL.revokeObjectURL(i.preview);
        } catch {}
      });
      objectUrlsRef.current = [];
      setImages([]);
    } catch (err) {
      console.error("Failed to post event:", err);
      toast.error(err.response?.data?.message || "Failed to post event");
    } finally {
      setPosting(false);
    }
  };

  // Edit event
  const openEdit = (ev) => {
    setEditingId(ev._id);
    setEditTitle(ev.title || "");
    setEditDetails(ev.details || "");
    setEditNewImages([]);
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
      if (removed?.preview) {
        try {
          URL.revokeObjectURL(removed.preview);
        } catch {}
        objectUrlsRef.current = objectUrlsRef.current.filter(
          (u) => u !== removed.preview
        );
      }
      return copy;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!canPostOrEdit) {
      toast.error("You don't have permission to edit events.");
      return;
    }
    if (!editingId) {
      toast.error("No event selected to edit.");
      return;
    }

    setEditing(true);
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("details", editDetails);

      const descriptions = editNewImages.map(
        (i) => i.description || "No description"
      );
      formData.append("descriptions", JSON.stringify(descriptions));
      editNewImages.forEach((img) => formData.append("images", img.file));

      await axios.put(
        `https://cec-hub-qme6.vercel.app/api/notification/event/${editingId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Event updated successfully");

      if (typeof fetchNotifications === "function") await fetchNotifications();
      else {
        const res = await axios.get(
          "https://cec-hub-qme6.vercel.app/api/notification"
        );
        setLocalNotifications(res.data.notifications || []);
        if (typeof setNotification === "function")
          setNotification(res.data.notifications || []);
      }

      editNewImages.forEach((i) => {
        try {
          URL.revokeObjectURL(i.preview);
        } catch {}
      });
      objectUrlsRef.current = objectUrlsRef.current.filter(
        (u) => !editNewImages.find((ei) => ei.preview === u)
      );
      setEditNewImages([]);
      setEditingId(null);
      setEditTitle("");
      setEditDetails("");
    } catch (err) {
      console.error("Failed to update event:", err);
      toast.error(err.response?.data?.message || "Failed to update event");
    } finally {
      setEditing(false);
    }
  };

  const cancelEdit = () => {
    editNewImages.forEach((i) => {
      try {
        URL.revokeObjectURL(i.preview);
      } catch {}
    });
    objectUrlsRef.current = objectUrlsRef.current.filter(
      (u) => !editNewImages.find((ei) => ei.preview === u)
    );
    setEditNewImages([]);
    setEditingId(null);
    setEditTitle("");
    setEditDetails("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" />
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Post new event */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post an Event</h2>

          {!canPostOrEdit && (
            <p className="text-sm text-red-600 mb-3">
              Only lecturers, President, or Public Relations Officer (PRO) can
              post events.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300"
                placeholder="Event title"
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
                className="w-full p-3 rounded-xl border border-gray-300 resize-none"
                placeholder="Event details"
                required
                disabled={!canPostOrEdit || posting}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Images (optional)
              </label>
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
                    <img
                      src={img.preview}
                      alt={`preview-${idx}`}
                      className="w-36 h-36 object-cover rounded-lg border"
                    />
                    <input
                      type="text"
                      value={img.description}
                      onChange={(e) =>
                        handleImageDescriptionChange(idx, e.target.value)
                      }
                      placeholder="Image description"
                      className="mt-2 w-full p-1 rounded border text-sm"
                      disabled={posting}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="mt-1 w-full bg-red-500 text-white py-1 rounded text-xs"
                    >
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
                className={`w-full py-3 rounded-xl font-bold text-white ${
                  posting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {posting ? "Posting..." : "Post Event"}
              </button>
            </div>
          </form>
        </div>

        {/* Edit panel */}
        {editingId && (
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Edit Event</h3>
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
                <label className="block font-semibold mb-1">
                  Add New Images (appended)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditFileChange}
                  disabled={!canPostOrEdit || editing}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Existing images are preserved. To remove them, you’ll need a
                  backend delete endpoint.
                </p>
              </div>

              {editNewImages.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-3">
                  {editNewImages.map((img, idx) => (
                    <div key={idx} className="w-36">
                      <img
                        src={img.preview}
                        alt={`edit-preview-${idx}`}
                        className="w-36 h-36 object-cover rounded-lg border"
                      />
                      <input
                        type="text"
                        value={img.description}
                        onChange={(e) =>
                          handleEditNewDescriptionChange(idx, e.target.value)
                        }
                        placeholder="Image description"
                        className="mt-2 w-full p-1 rounded border text-sm"
                        disabled={editing}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditNewImage(idx)}
                        className="mt-1 w-full bg-red-500 text-white py-1 rounded text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!canPostOrEdit || editing}
                  className={`px-6 py-2 rounded-xl font-semibold text-white ${
                    editing
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {editing ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={editing}
                  className="px-6 py-2 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events list */}
        <div className="space-y-6">
          {loading && (
            <p className="text-center text-gray-600">Loading events...</p>
          )}
          {!loading && events.length === 0 && (
            <p className="text-center text-gray-600">No events found.</p>
          )}

          {events.map((ev) => (
            <div
              key={ev._id}
              className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{ev.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted by: {ev.postedBy?.name || "Unknown"} •{" "}
                    {new Date(ev.createdAt).toLocaleString()}
                  </p>
                </div>
                {canPostOrEdit && (
                  <button
                    onClick={() => openEdit(ev)}
                    className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="mt-3 text-gray-700 whitespace-pre-wrap">
                {ev.details}
              </div>

              {ev.images && ev.images.length > 0 && (
                <div className="mt-



4 grid grid-cols-2 md:grid-cols-4 gap-3">
{ev.images.map((img, i) => ( <div key={i} className="rounded overflow-hidden border">
<img
src={img.url}
alt={img.description || `event-img-${i}`}
className="w-full h-40 object-cover"
/>
{img.description && ( <div className="p-2 text-sm text-gray-600">
{img.description} </div>
)} </div>
))} </div>
)} </div>
))} </div> </div> </div>
);
}

