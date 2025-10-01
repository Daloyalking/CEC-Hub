import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { DeptContext } from "../context/DeptContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditGalleryModal = ({ galleryItem, onClose }) => {
  const { updateGallery } = useContext(DeptContext);
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState(galleryItem.title || "");
  const [description, setDescription] = useState(galleryItem.description || "");
  const [category, setCategory] = useState(galleryItem.category || "");
  const [takenOn, setTakenOn] = useState(
    galleryItem.takenOn ? galleryItem.takenOn.split("T")[0] : ""
  );

  const [existingPhotos, setExistingPhotos] = useState(galleryItem.photos || []);
  const [photosToDelete, setPhotosToDelete] = useState([]); // identifiers (public_id or url)

  const [newImages, setNewImages] = useState([]); // {file, url}
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      // revoke new image urls when modal unmounts
      newImages.forEach((n) => URL.revokeObjectURL(n.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMarkDelete = (photo) => {
    const id = photo.public_id || photo.url;
    if (!id) return;
    if (photosToDelete.includes(id)) {
      setPhotosToDelete((prev) => prev.filter((p) => p !== id));
    } else {
      setPhotosToDelete((prev) => [...prev, id]);
    }
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    const added = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setNewImages((prev) => [...prev, ...added]);
  };

  const removeNewImage = (index) => {
    const copy = [...newImages];
    URL.revokeObjectURL(copy[index].url);
    copy.splice(index, 1);
    setNewImages(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("You must be logged in to edit a gallery item");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("category", category);
      fd.append("takenOn", takenOn || new Date().toISOString().split("T")[0]);

      if (photosToDelete.length > 0) {
        fd.append("photosToDelete", JSON.stringify(photosToDelete));
      }

      newImages.forEach((n) => fd.append("photos", n.file));

      const updated = await updateGallery(galleryItem._id, fd);

      toast.success("Gallery updated successfully");
      onClose(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update gallery");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start md:items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full rounded-2xl p-6 overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Edit Gallery</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={3} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date Taken</label>
            <input type="date" value={takenOn} onChange={(e) => setTakenOn(e.target.value)} className="w-full p-2 border rounded" />
          </div>

          {/* Existing photos */}
          <div>
            <label className="block mb-2 font-medium">Existing Photos</label>
            <div className="grid grid-cols-3 gap-3">
              {existingPhotos.length === 0 && <p className="text-sm text-gray-500">No existing photos</p>}
              {existingPhotos.map((p, idx) => {
                const id = p.public_id || p.url;
                const marked = photosToDelete.includes(id);
                return (
                  <div key={idx} className={`relative rounded overflow-hidden border ${marked ? "opacity-40" : ""}`}>
                    <img src={p.url} alt={`photo-${idx}`} className="w-full h-28 object-cover" />
                    <button type="button" onClick={() => toggleMarkDelete(p)} className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${marked ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}>
                      {marked ? "Keep" : "Remove"}
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">Click Remove to mark a photo for deletion. It will be deleted on save.</p>
          </div>

          {/* Add new photos */}
          <div>
            <label className="block mb-1 font-medium">Add New Photos</label>
            <input type="file" multiple accept="image/*" onChange={handleNewImages} />

            {newImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {newImages.map((n, i) => (
                  <div key={i} className="relative rounded overflow-hidden border">
                    <img src={n.url} alt={`new-${i}`} className="w-full h-28 object-cover" />
                    <button type="button" onClick={() => removeNewImage(i)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => onClose(null)} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-purple-600 text-white">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PostGalleryPage = () => {
  const { user } = useContext(AuthContext);
  const { gallery, setGallery, createGallery, updateGallery, fetchGallery, loadingGallery } = useContext(DeptContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]); // {file, url}
  const [takenOn, setTakenOn] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    // ensure we have latest gallery when page mounts
    if (!gallery || gallery.length === 0) fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImages]);
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

      images.forEach((img) => formData.append("photos", img.file));

      // use context helper which also updates local gallery state
      await createGallery(formData);

      toast.success("Gallery item posted successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setImages([]);
      setTakenOn("");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while posting the gallery");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (item) => setEditingItem(item);
  const closeEdit = (updated) => {
    setEditingItem(null);
    if (updated) {
      // updated already set in context.updateGallery, but ensure local state sync
      setGallery((prev) => prev.map((g) => (g._id === updated._id ? updated : g)));
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="p-6 md:p-8 bg-purple-50 rounded-3xl shadow-xl border border-purple-200 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700 mb-6 text-center">Post a Gallery Item</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold text-purple-800">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="Enter gallery title" required />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold text-purple-800">Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" placeholder="Enter gallery description" rows={3} required />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-semibold text-purple-800">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400" required>
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
              <input type="date" value={takenOn} onChange={(e) => setTakenOn(e.target.value)} className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <p className="text-sm text-gray-600 mt-1">Leave empty to use today's date</p>
            </div>

            {/* Images Upload */}
            <div>
              <label className="block mb-2 font-semibold text-purple-800">Upload Images *</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
              <p className="text-sm text-gray-600 mt-1">Select one or multiple images</p>
            </div>

            {/* Preview */}
            {images.length > 0 && (
              <div className="space-y-4 mt-4">
                <h3 className="font-semibold text-purple-800">Selected Images ({images.length})</h3>
                {images.map((img, idx) => (
                  <div key={idx} className="bg-purple-100 p-3 md:p-4 rounded-xl border border-purple-200">
                    <div className="flex flex-col md:flex-row md:items-start gap-3">
                      <div className="flex-shrink-0">
                        <img src={img.url} alt={`preview-${idx}`} className="w-full md:w-24 h-24 object-cover rounded-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium text-purple-700 mb-1">Image Description</label>
                        <input type="text" placeholder="Describe this image..." value={img.description} onChange={(e) => {
                          const copy = [...images];
                          copy[idx].description = e.target.value;
                          setImages(copy);
                        }} className="w-full p-2 md:p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm md:text-base" />
                      </div>
                      <button type="button" onClick={() => removeImage(idx)} className="bg-red-500 text-white py-2 px-3 md:px-4 rounded-lg hover:bg-red-600 transition text-sm md:text-base whitespace-nowrap mt-2 md:mt-0 self-start">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-purple-700 transition duration-200 shadow-md mt-4 disabled:opacity-50">{loading ? "Posting..." : "Post Gallery Item"}</button>
          </form>
        </div>

        {/* LIST OF GALLERIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingGallery && <p className="text-center">Loading galleries...</p>}
          {!loadingGallery && gallery.length === 0 && <p className="text-center">No gallery items yet.</p>}

          {gallery.map((g) => (
            <div key={g._id} className="bg-white rounded-2xl shadow p-4 border">
              <div className="w-full h-44 bg-gray-100 rounded overflow-hidden mb-3">
                <img src={g.photos?.[0]?.url ?? ""} alt={g.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg">{g.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{g.description}</p>
              <div className="text-xs text-gray-500 mt-2">Category: {g.category} • Taken: {g.takenOn ? g.takenOn.split("T")[0] : "-"}</div>

              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(g)} className="px-3 py-2 rounded bg-yellow-400 text-sm">Edit</button>
              </div>

              {/* small photos strip */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {g.photos?.map((p, i) => (
                  <img key={i} src={p.url} alt={`thumb-${i}`} className="w-full h-20 object-cover rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingItem && <EditGalleryModal galleryItem={editingItem} onClose={closeEdit} />}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default PostGalleryPage;
