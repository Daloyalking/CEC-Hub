import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { user, token, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    matric: "",
    level: "",
    role: "",
  });
  const [preview, setPreview] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        matric: user.matric || "",
        level: user.level || "",
        role: user.role || "",
      });
      setPreview(user.picture ? `http://localhost:4000/${user.picture}` : null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData({ ...formData, picture: file });
    }
  };

  // Update profile info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      if (formData.role === "student") {
        payload.append("matric", formData.matric);
        payload.append("level", formData.level);
      }
      if (formData.picture instanceof File) payload.append("picture", formData.picture);

      const res = await fetch("http://localhost:4000/api/user/edit", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Profile update failed");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return toast.error("Please fill both fields");

    try {
      const res = await fetch("http://localhost:4000/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.info("Logged out successfully", { autoClose: 1500 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-300 flex justify-center items-start py-12">
      <ToastContainer position="top-right" />

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center md:w-1/3 gap-4">
          <div className="relative">
            <img
              src={preview || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-purple-400 shadow-lg"
            />
            <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              ✎
            </label>
          </div>
          <h2 className="text-xl font-bold text-purple-700">{formData.name}</h2>
          <p className="text-gray-500 uppercase text-sm">{formData.role}</p>
        </div>

        {/* User Info */}
        <div className="md:w-2/3 flex flex-col gap-6">
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Information</h3>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
              {formData.role === "student" && (
                <>
                  <input type="text" name="matric" value={formData.matric} onChange={handleChange} placeholder="Matric Number" className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
                  <input type="text" name="level" value={formData.level} onChange={handleChange} placeholder="Level" className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" required />
                </>
              )}
              <input type="text" name="role" value={formData.role} disabled className="p-3 border rounded-lg bg-gray-100 cursor-not-allowed" />
              <button type="submit" className="col-span-1 md:col-span-2 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition mt-2">Update Profile</button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h3>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input type={showOldPassword ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-3 text-gray-500">{showOldPassword ? "🙈" : "👁"}</button>
              </div>
              <div className="relative">
                <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400" />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3 text-gray-500">{showNewPassword ? "🙈" : "👁"}</button>
              </div>
              <button onClick={handleChangePassword} className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">Update Password</button>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition shadow-lg">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
