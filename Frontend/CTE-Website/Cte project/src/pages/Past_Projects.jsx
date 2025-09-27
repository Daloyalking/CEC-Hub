import React, { useContext, useState, useEffect } from "react";
import { DeptContext } from "../context/DeptContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Past_Projects = () => {
  const { projects, fetchProjects, loadingProjects } = useContext(DeptContext);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filterLecturer, setFilterLecturer] = useState("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  // Unique lecturers for filter dropdown
  const lecturers = [...new Set(projects.map((p) => p.conductedBy?.name))];

  const filteredProjects = projects
    .filter(
      (p) =>
        p.topic.toLowerCase().includes(search.toLowerCase()) ||
        p.details.toLowerCase().includes(search.toLowerCase()) ||
        (p.conductedBy?.name || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      filterLecturer === "all" ? true : p.conductedBy?.name === filterLecturer
    )
    .sort((a, b) => (sort === "newest" ? b.year - a.year : a.year - b.year));

  const handleSortChange = (value) => {
    setSort(value);
    toast.success(value === "newest" ? "Sorted: Newest → Oldest" : "Sorted: Oldest → Newest");
  };

  const handleLecturerFilter = (value) => {
    setFilterLecturer(value);
    toast.success(value === "all" ? "Showing all lecturers" : `Filtered by ${value}`);
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">Past Projects</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="newest">Sort: Newest → Oldest</option>
          <option value="oldest">Sort: Oldest → Newest</option>
        </select>

        <select
          value={filterLecturer}
          onChange={(e) => handleLecturerFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Lecturers</option>
          {lecturers.map((lecturer, i) => (
            <option key={i} value={lecturer}>
              {lecturer}
            </option>
          ))}
        </select>
      </div>

      {/* Loader */}
      {loadingProjects ? (
        <p className="text-center text-gray-500">Loading projects...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div key={project._id} className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold">{project.topic}</h2>
              <p className="text-sm text-gray-600 mb-3">{project.details}</p>

              {project.photos?.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {project.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo.url}
                        alt={photo.description}
                        className="rounded-md object-cover w-full h-32"
                      />
                      <p className="text-xs text-gray-500 mt-1">{photo.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {project.conductedBy && (
                <div className="flex items-center mt-2">
                  <img
                    src={project.conductedBy.image || "https://via.placeholder.com/50"}
                    alt={project.conductedBy.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-medium">{project.conductedBy.name}</p>
                    <p className="text-xs text-gray-500">{project.conductedBy.designation}</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">Year: {project.year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Past_Projects;
