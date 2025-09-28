import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MaterialPage = () => {
  const { user, token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [level, setLevel] = useState("");
  const [documents, setDocuments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false); // new state for posting

  // Fetch existing materials from backend
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://cec-hub-qme6.vercel.app/api/notification/material");
      setMaterials(res.data.materials || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      file,
      name: file.name,
      description: "",
      preview: URL.createObjectURL(file),
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const handleDescriptionChange = (index, value) => {
    const newDocs = [...documents];
    newDocs[index].description = value;
    setDocuments(newDocs);
  };

  const handleRemoveDocument = (index) => {
    const newDocs = documents.filter((_, i) => i !== index);
    setDocuments(newDocs);
    toast.info("Document removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !details || !level) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (!user || user.role !== "lecturer") {
      toast.error("Only lecturers can post materials");
      return;
    }

    try {
      setPosting(true); // start posting
      const formData = new FormData();
      formData.append("title", title);
      formData.append("details", details);
      formData.append("level", level);

      documents.forEach((doc) => {
        formData.append("documents", doc.file);
      });

      const descriptions = documents.map((doc) => doc.description || "No description");
      formData.append("descriptions", JSON.stringify(descriptions));

      await axios.post(
        "https://cec-hub-qme6.vercel.app/api/notification/material",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Material posted successfully!");
      setTitle("");
      setDetails("");
      setLevel("");
      setDocuments([]);
      fetchMaterials(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to post material");
    } finally {
      setPosting(false); // end posting
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold text-purple-700 mb-6">Materials</h1>

      {user?.role === "lecturer" && (
        <div className="w-full max-w-2xl p-6 mb-8 bg-purple-50 rounded-3xl shadow-xl border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
            Post Material
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />

            <textarea
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              rows={4}
              required
            />

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="">Select Level</option>
              <option value="ND1">ND1</option>
              <option value="ND2">ND2</option>
              <option value="HND1">HND1</option>
              <option value="HND2">HND2</option>
              <option value="All">All</option>
            </select>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            {documents.length > 0 && (
              <div className="flex flex-col gap-3 mt-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-purple-100 p-2 rounded-xl border border-purple-200"
                  >
                    <div>
                      <p className="font-semibold text-purple-700 text-sm">{doc.name}</p>
                      <input
                        type="text"
                        placeholder="Description"
                        value={doc.description}
                        onChange={(e) =>
                          handleDescriptionChange(index, e.target.value)
                        }
                        className="mt-1 w-full p-1 rounded border border-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="ml-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-xs transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-purple-700 transition duration-200 shadow-md mt-4"
              disabled={posting}
            >
              {posting ? "Posting..." : "Post Material"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MaterialPage;
