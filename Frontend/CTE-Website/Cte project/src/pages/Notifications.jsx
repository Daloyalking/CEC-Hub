import React, { useContext, useState } from "react";
import { DeptContext } from "../context/DeptContext";

const Notifications = () => {
  const { notification } = useContext(DeptContext);
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting logic
  const sortedNotifications = [...notification].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (sortOption === "oldest") {
      return new Date(a.timestamp) - new Date(b.timestamp);
    } else if (sortOption === "author-asc") {
      return a.postedBy.name.localeCompare(b.postedBy.name);
    } else if (sortOption === "author-desc") {
      return b.postedBy.name.localeCompare(a.postedBy.name);
    }
    return 0;
  });

  // Search logic
  const filteredNotifications = sortedNotifications.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.details.toLowerCase().includes(query) ||
      note.postedBy.name.toLowerCase().includes(query)
    );
  });
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">All Notifications</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2 text-sm focus:ring-2 focus:ring-blue-500"
        />

        {/* Sorting Dropdown */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="newest">Newest → Oldest</option>
          <option value="oldest">Oldest → Newest</option>
          <option value="author-asc">Author (A → Z)</option>
          <option value="author-desc">Author (Z → A)</option>
        </select>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-6">
          {filteredNotifications.map((note) => (
            <div
              key={note.id}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
            >
              {/* Title + Author */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={note.postedBy.image}
                  alt={note.postedBy.name}
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {note.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {note.postedBy.name} •{" "}
                    {new Date(note.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Details */}
              <p className="text-sm text-gray-700 mb-3">{note.details}</p>

              {/* Images (Events) */}
              {note.images && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {note.images.map((img, index) => (
                    <div key={index} className="flex flex-col">
                      <img
                        src={img.url}
                        alt={img.description}
                        className="rounded-md w-full max-h-48 object-cover"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {img.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Documents (Materials) */}
              {note.documents && (
                <div className="mt-3 space-y-1">
                  {note.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm block"
                    >
                      📄 {doc.description}
                    </a>
                  ))}
                </div>
              )}

              {/* Reminder Badge */}
              {note.level && (
                <p className="mt-3 inline-block text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  Reminder: Level {note.level}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-center mt-10">
          No notifications match your search.
        </p>
      )}
    </div>
  );
};

export default Notifications;
