import React, { useContext, useEffect, useState } from "react";
import { DeptContext } from "../context/DeptContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Lecture_Materials = () => {
  const { notification, setNotification } = useContext(DeptContext);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filterLevel, setFilterLevel] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch all notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("https://cec-hub-qme6.vercel.app/api/notification");
      setNotification(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter only lecture materials
  const lectureMaterials = notification.filter((n) => n.type === "material");

  // Unique levels for dropdown
  const levels = [...new Set(lectureMaterials.map((m) => m.level).filter(Boolean))];

  // Apply search, filter, sort
  const filtered = lectureMaterials
    .filter(
      (m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.details.toLowerCase().includes(search.toLowerCase())
    )
    .filter((m) => (filterLevel === "all" ? true : m.level === filterLevel))
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  // Handle material download
  const handleDownload = (materialId, docPublicId, filename) => {
    const url = `http://localhost:4000/api/notification/download-material?id=${materialId}&doc=${encodeURIComponent(docPublicId)}`;
    // Open in new tab to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-6">Lecture Materials</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="newest">Sort: Newest → Oldest</option>
          <option value="oldest">Sort: Oldest → Newest</option>
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Levels</option>
          {levels.map((lvl, i) => (
            <option key={i} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <p>Loading materials...</p>
      ) : filtered.length === 0 ? (
        <p>No lecture materials available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-600 mb-3">{item.details}</p>
              <p className="text-sm font-medium text-indigo-600 mb-2">
                Level: {item.level || "All Students"}
              </p>

              {item.documents?.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">Documents:</h3>
                  <ul className="list-disc ml-5">
                    {item.documents.map((doc, i) => (
                      <li key={i}>
                        <button
                          onClick={() => handleDownload(item._id, doc.public_id, doc.name)}
                          className="text-blue-500 hover:underline"
                        >
                          {doc.name} ({doc.description || "No description"})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Uploaded: {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lecture_Materials;
