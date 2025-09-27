import React, { useContext, useState } from "react";
import { DeptContext } from "../context/DeptContext";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExcoPage = () => {
  const { excos, addExco, deleteExco, loadingExcos } = useContext(DeptContext);
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [post, setPost] = useState("");
  const [customPost, setCustomPost] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([
    "President",
    "Vice President",
    "General Secretary",
    "Assistant General Secretary",
    "Financial Secretary",
    "Treasurer",
    "Public Relations Officer (PRO)",
    "Assistant PRO",
    "Welfare Secretary",
    "Sports Secretary",
  ]);

  const allowedRoles = ["hod", "president", "public relations officer (pro)"];
  const canManage =
    user &&
    (allowedRoles.includes(user.position?.toLowerCase()) ||
      allowedRoles.includes(user.post?.toLowerCase()));

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    let finalPost = post;

    if (post === "other" && customPost.trim()) {
      finalPost = customPost.trim();
      if (!posts.includes(finalPost)) {
        setPosts([...posts, finalPost]);
        toast.info(`🆕 New post "${finalPost}" added to list`);
      }
    }

    if (!name || !finalPost || !photo) {
      toast.error("⚠️ Please fill in all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("post", finalPost);
    formData.append("photo", photo);

    await addExco(formData);
    toast.success(`✅ ${name} added as ${finalPost}`);

    setName("");
    setPost("");
    setCustomPost("");
    setPhoto(null);
    setPreview(null);
  };

  const handleDelete = async (id, name) => {
    await deleteExco(id);
    toast.info(`🗑️ ${name} removed`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold mb-6 text-center">Department Excos</h1>

      {canManage && (
        <form
          onSubmit={handleAdd}
          className="bg-purple-50 p-4 rounded-lg shadow mb-6"
        >
          <h2 className="font-semibold mb-2">Add Exco</h2>

          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <select
            value={post}
            onChange={(e) => setPost(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">-- Select Post --</option>
            {posts.map((p, idx) => (
              <option key={idx} value={p}>
                {p}
              </option>
            ))}
            <option value="other">Other (Add new post)</option>
          </select>

          {post === "other" && (
            <input
              type="text"
              placeholder="Enter new post"
              value={customPost}
              onChange={(e) => setCustomPost(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="border p-2 rounded w-full mb-2"
          />

          {preview && (
            <div className="mb-3 text-center">
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Add Exco
          </button>
        </form>
      )}

      {loadingExcos ? (
        <p className="text-center">Loading Excos...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {excos.map((ex) => (
            <div
              key={ex._id}
              className="bg-white shadow rounded-lg overflow-hidden p-4 text-center"
            >
              <img
                src={ex.photo}
                alt={ex.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-3"
              />
              <h2 className="font-bold">{ex.name}</h2>
              <p className="text-sm text-gray-600">{ex.post}</p>

              {canManage && (
                <button
                  onClick={() => handleDelete(ex._id, ex.name)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExcoPage;
