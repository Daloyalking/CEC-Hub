// Other_Materials.jsx
import React, { useContext, useEffect, useState } from "react";
import { DeptContext } from "../context/DeptContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Other_Materials = () => {
  const { notification } = useContext(DeptContext);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // Filter only non-lecture materials
  const otherMaterials = notification.filter((n) => n.type === "other");

  const filtered = otherMaterials
    .filter(
      (m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.details.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

  // Toastify alerts when filter/search affects results
  useEffect(() => {
    if (search && filtered.length === 0) {
      toast.info("No materials found for your search.");
    }
  }, [search, filtered.length]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Other Materials</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search documents..."
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
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No other materials available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-600 mb-3">{item.details}</p>

              {item.documents?.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">Documents:</h3>
                  <ul className="list-disc ml-5">
                    {item.documents.map((doc, i) => (
                      <li key={i}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {doc.name || "View Document"}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Uploaded: {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Other_Materials;
