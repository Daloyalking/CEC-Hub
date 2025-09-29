import React, { useContext, useState } from "react";
import { DeptContext } from "../context/DeptContext";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostLecturerPage = () => {
  const { lecturers, addLecturer, deleteLecturer } = useContext(DeptContext);
  const { user, token } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hodStatus, setHodStatus] = useState("others"); // default select value
  const [loading, setLoading] = useState(false); // loading state

  if (!user || !user.position) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-semibold text-red-500">
          Access Denied: HODs Only
        </h1>
      </div>
    );
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddLecturer = async (e) => {
    e.preventDefault();
    if (!name || !photoFile) {
      toast.error("Please provide both name and photo!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("photo", photoFile);
    formData.append("hod", hodStatus === "hod"); // true if HOD, false otherwise

    try {
      setLoading(true);
      await addLecturer(formData, token);
      toast.success(`${name} added successfully!`);
      setName("");
      setPhotoFile(null);
      setPreview(null);
      setHodStatus("others");
    } catch (err) {
      toast.error("Failed to add lecturer");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecturer = async (id, lecturerName) => {
    try {
      await deleteLecturer(id);
      toast.info(`${lecturerName} has been removed.`);
    } catch (err) {
      toast.error("Failed to delete lecturer");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        Manage Lecturers
      </h1>

      {/* Add Lecturer Form */}
      <form
        onSubmit={handleAddLecturer}
        className="bg-white shadow-md rounded-lg p-6 mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Add Lecturer</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        {/* HOD Select */}
        <select
          value={hodStatus}
          onChange={(e) => setHodStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="hod">HOD</option>
          <option value="others">Others</option>
        </select>

        {/* Preview image */}
        {preview && (
          <div className="mb-4 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Add Lecturer"}
        </button>
      </form>

      {/* Lecturers List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lecturers.map((lecturer) => (
          <div
            key={lecturer._id}
            className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col items-center"
          >
            <img
              src={lecturer.photo}
              alt={lecturer.name}
              className="w-32 h-32 rounded-full object-cover mb-3"
            />
            <h3 className="font-semibold text-lg text-center">{lecturer.name}</h3>
            {lecturer.hod && (
              <span className="mt-2 inline-block bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold rounded-full">
                Head of Department
              </span>
            )}
            <button
              onClick={() => handleDeleteLecturer(lecturer._id, lecturer.name)}
              className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostLecturerPage;
