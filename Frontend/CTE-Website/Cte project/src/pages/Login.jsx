// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hardcoded Exco posts
const hardcodedExcos = [
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
];

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("student"); // student | lecturer | alumni
  const [position, setPosition] = useState("other"); // used for lecturer HOD/other or student exco post (when applicable)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    matric: "",
    level: "",
    password: "",
    identifier: "",
    picture: null,
  });
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [localExcos, setLocalExcos] = useState(hardcodedExcos);
  const [addingNewExco, setAddingNewExco] = useState(false);
  const [newExco, setNewExco] = useState("");

  const { user, login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    // sensible defaults
    if (selectedRole === "student") {
      setPosition("other");
    } else if (selectedRole === "lecturer") {
      setPosition("other");
    } else if (selectedRole === "alumni") {
      setPosition("");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, picture: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleExcoSelect = (e) => {
    const value = e.target.value;
    if (value === "add_new") {
      setAddingNewExco(true);
      setPosition("");
    } else {
      setPosition(value);
      setAddingNewExco(false);
    }
  };

  const handleNewExcoSubmit = () => {
    if (newExco.trim() === "") return;
    if (!localExcos.includes(newExco)) {
      setLocalExcos((prev) => [...prev, newExco]);
    }
    setPosition(newExco);
    setNewExco("");
    setAddingNewExco(false);
  };

  const validateSignUpFields = () => {
    // Common required: name, email, phone, password
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Please fill in your name, email, phone and password.");
      return false;
    }

    if (role === "student") {
      if (!formData.matric || !formData.level) {
        toast.error("Students must provide matric number and level.");
        return false;
      }
    }

    if (role === "alumni") {
      if (!formData.matric) {
        toast.error("Alumni must provide matric number.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Validate fields per role
      if (!validateSignUpFields()) return;

      try {
        const data = new FormData();
        data.append("role", role);
        // position: for lecturers and students we include a value, alumni gets empty (backend handles it)
        data.append("position", position || "");

        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("password", formData.password);

        if (role === "student") {
          data.append("matric", formData.matric);
          data.append("level", formData.level);
        } else if (role === "alumni") {
          data.append("matric", formData.matric);
        }

        if (formData.picture) {
          data.append("picture", formData.picture);
        }

        // DEBUG: log FormData entries (File objects will print as File)
        // eslint-disable-next-line no-console
        for (const pair of data.entries()) {
          // pair[1] might be File or string
          // eslint-disable-next-line no-console
          console.log("formData:", pair[0], pair[1]);
        }

        // IMPORTANT: DO NOT set Content-Type manually. Let axios/browser set the correct multipart boundary.
        const res = await axios.post(
          "https://cec-hub-qme6.vercel.app/api/user/signup",
          data,
          {
            withCredentials: true,
          }
        );

        // on success: login and redirect
        login(res.data.user, res.data.token);
        toast.success("Account created successfully!", { autoClose: 2000 });
        navigate("/");
      } catch (err) {
        // show server message where available
        // eslint-disable-next-line no-console
        console.error("Signup error:", err.response?.data || err.message || err);
        toast.error(err.response?.data?.message || "Signup failed", {
          autoClose: 2500,
        });
      }
    } else {
      // Login flow
      try {
        const res = await axios.post(
          "https://cec-hub-qme6.vercel.app/api/user/login",
          {
            identifier: formData.identifier,
            password: formData.password,
          },
          {
            withCredentials: true,
          }
        );

        login(res.data.user, res.data.token);
        toast.success("Login successful!", { autoClose: 2000 });
        navigate("/");
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Login error:", err.response?.data || err.message || err);
        toast.error(
          err.response?.data?.message || "Incorrect login details. Please try again.",
          { autoClose: 2500 }
        );
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.identifier) {
      return toast.error("Please enter your email/phone/matric first.", {
        autoClose: 2500,
      });
    }

    try {
      await axios.post(
        "https://cec-hub-qme6.vercel.app/api/user/password-reset-request",
        {
          identifier: formData.identifier,
        }
      );
      toast.success("Password reset link sent to your email", {
        autoClose: 3000,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Password reset request error:", err.response?.data || err.message || err);
      toast.error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-purple-300">
      <ToastContainer position="top-right" />
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              {/* Role Selection */}
              <div className="flex justify-center gap-4 mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg border transition ${
                    role === "student"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleRoleChange("student")}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg border transition ${
                    role === "lecturer"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleRoleChange("lecturer")}
                >
                  Lecturer
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg border transition ${
                    role === "alumni"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleRoleChange("alumni")}
                >
                  Alumni
                </button>
              </div>

              {/* Position Selection or Exco (Student) */}
              {role === "lecturer" ? (
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg border transition ${
                      position === "hod"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPosition("hod")}
                  >
                    HOD
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg border transition ${
                      position === "other"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPosition("other")}
                  >
                    Others
                  </button>
                </div>
              ) : role === "student" ? (
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Exco Position (optional)
                  </label>
                  {!addingNewExco ? (
                    <select
                      value={position}
                      onChange={handleExcoSelect}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                    >
                      <option value="other">None</option>
                      {localExcos.map((post, idx) => (
                        <option key={idx} value={post}>
                          {post}
                        </option>
                      ))}
                      <option value="add_new">Add New Post</option>
                    </select>
                  ) : (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newExco}
                        onChange={(e) => setNewExco(e.target.value)}
                        placeholder="Enter new post"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleNewExcoSubmit}
                        className="bg-purple-600 text-white px-4 rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Common fields */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              {/* Student-specific fields */}
              {role === "student" && (
                <>
                  <input
                    type="text"
                    name="matric"
                    placeholder="Matric Number"
                    value={formData.matric}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="ND1">ND1</option>
                    <option value="ND2">ND2</option>
                    <option value="HND1">HND1</option>
                    <option value="HND2">HND2</option>
                  </select>
                </>
              )}

              {/* Alumni-specific: matric only (no level) */}
              {role === "alumni" && (
                <input
                  type="text"
                  name="matric"
                  placeholder="Matric Number"
                  value={formData.matric}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Profile Picture (OPTIONAL) */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Upload Profile Picture (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {preview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-28 h-28 object-cover rounded-full border-2 border-purple-300 shadow"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Login Section */}
          {!isSignUp && (
            <>
              <input
                type="text"
                name="identifier"
                placeholder="Email / Phone / Matric Number"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <p
                onClick={handleForgotPassword}
                className="text-sm text-purple-600 text-right cursor-pointer hover:underline"
              >
                Forgot Password?
              </p>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 shadow-md transition duration-200"
          >
            {isSignUp ? "Register" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
