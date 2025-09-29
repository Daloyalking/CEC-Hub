import React, { useContext, useState } from "react";
import { DeptContext } from "../context/DeptContext";

const Departmental_Gallery = () => {
const { gallery, loadingGallery } = useContext(DeptContext);

const [search, setSearch] = useState("");
const [sortOrder, setSortOrder] = useState("newest");
const [selectedImage, setSelectedImage] = useState(null); // for modal

// Filter + sort
const filteredGallery = gallery
.filter(
(item) =>
item.title.toLowerCase().includes(search.toLowerCase()) ||
item.description.toLowerCase().includes(search.toLowerCase()) ||
item.category.toLowerCase().includes(search.toLowerCase())
)
.sort((a, b) => {
if (sortOrder === "newest") {
return new Date(b.takenOn) - new Date(a.takenOn);
} else {
return new Date(a.takenOn) - new Date(b.takenOn);
}
});

return ( <div className="max-w-6xl mx-auto p-6"> <h1 className="text-3xl font-bold mb-6 text-center">Departmental Gallery</h1>

  {/* Search & Sort */}
  <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
    <input
      type="text"
      placeholder="Search..."
      className="border rounded-md px-4 py-2 w-full md:w-1/2"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      className="border rounded-md px-4 py-2"
    >
      <option value="newest">Sort by Newest</option>
      <option value="oldest">Sort by Oldest</option>
    </select>
  </div>

  {/* Loading State */}
  {loadingGallery ? (
    <p className="text-center text-gray-500">Loading gallery...</p>
  ) : filteredGallery.length === 0 ? (
    <p className="text-center text-gray-500">No gallery items found.</p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredGallery.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          {/* Multiple photos slider */}
          <div className="flex overflow-x-auto no-scrollbar space-x-2">
            {item.photos.map((photo, index) => (
              <img
                key={index}
                src={photo.url}
                alt={photo.description || "Gallery photo"}
                className="h-48 w-auto object-contain flex-shrink-0 cursor-pointer hover:opacity-80 transition"
                onClick={() => setSelectedImage(photo.url)} // open modal
              />
            ))}
          </div>
          <div className="p-4">
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              📅 {new Date(item.takenOn).toDateString()} | 🏷 {item.category}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Modal for enlarged image */}
  {selectedImage && (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative">
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-black font-bold shadow-lg hover:bg-gray-200 transition"
        >
          ✕
        </button>
        <img
          src={selectedImage}
          alt="Enlarged preview"
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>
  )}
</div>

);
};

export default Departmental_Gallery;
