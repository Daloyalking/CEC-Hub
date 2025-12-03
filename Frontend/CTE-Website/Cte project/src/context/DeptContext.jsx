// -----------------------------
// File: src/context/DeptContext.jsx
// -----------------------------
import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const DeptContext = createContext();

const BASE = "https://cec-hub-qme6.vercel.app";

const DeptContextProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);
  const [notification, setNotification] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [excos, setExcos] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingExcos, setLoadingExcos] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const { token } = useContext(AuthContext);

  // --- EXCO ---
  const fetchExcos = async () => {
    try {
      const res = await axios.get(`${BASE}/api/exco`);
      setExcos(res.data || []);
    } catch (err) {
      console.error("Failed to fetch excos:", err);
      setExcos([]);
    } finally {
      setLoadingExcos(false);
    }
  };

  const addExco = async (formData) => {
    if (!token) return toast.error("Not authorized");

    try {
      const res = await axios.post(`${BASE}/api/exco`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setExcos((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add exco:", err);
      toast.error(err.response?.data?.message || "Failed to add exco");
    }
  };

  const deleteExco = async (id) => {
    if (!token) return toast.error("Not authorized");

    try {
      await axios.delete(`${BASE}/api/exco/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setExcos((prev) => prev.filter((ex) => ex._id !== id));
    } catch (err) {
      console.error("Failed to delete exco:", err);
      toast.error(err.response?.data?.message || "Failed to delete exco");
    }
  };

  // --- NOTIFICATIONS ---
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE}/api/notification`);
      setNotification(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotification([]);
    }
  };

  // --- GALLERY ---
  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const res = await axios.get(`${BASE}/api/gallery`);
      // backend returns an array of galleries
      setGallery(res.data || []);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
      setGallery([]);
    } finally {
      setLoadingGallery(false);
    }
  };

  /**
   * createGallery(formData)
   * - expects a FormData instance with fields: title, description, category, takenOn, photos[]
   */
  const createGallery = async (formData) => {
    if (!token) {
      toast.error("Not authorized");
      throw new Error("Not authorized");
    }

    try {
      const res = await axios.post(`${BASE}/api/gallery`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // controller responds with { message, gallery }
      const created = res.data?.gallery ?? res.data;
      if (created) setGallery((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Failed to create gallery:", err);
      toast.error(err.response?.data?.message || "Failed to create gallery");
      throw err;
    }
  };

  /**
   * updateGallery(id, formData)
   * - formData should be multipart/form-data when sending new files / photosToDelete
   */
  const updateGallery = async (id, formData) => {
    console.log(token)
    if (!token) {
      toast.error("Not authorized");
      throw new Error("Not authorized");
    }

    try {
      const res = await axios.patch(`${BASE}/api/gallery/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const updated = res.data?.gallery ?? res.data;
      if (updated) {
        setGallery((prev) => prev.map((g) => (g._id === id ? updated : g)));
      }
      return updated;
    } catch (err) {
      console.error("Failed to update gallery:", err);
      toast.error(err.response?.data?.message || "Failed to update gallery");
      throw err;
    }
  };

  // --- LECTURERS ---
  const fetchLecturers = async () => {
    try {
      const res = await axios.get(`${BASE}/api/lecturer`);
      setLecturers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch lecturers:", err);
      setLecturers([]);
    }
  };

  const addLecturer = async (formData) => {
    if (!token) return toast.error("Not authorized");

    try {
      const res = await axios.post(`${BASE}/api/lecturer`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setLecturers((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error("Failed to add lecturer:", err);
      toast.error(err.response?.data?.message || "Failed to add lecturer");
      throw err;
    }
  };

  const deleteLecturer = async (id) => {
    if (!token) return toast.error("Not authorized");

    try {
      const result = await axios.delete(`${BASE}/api/lecturer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      console.log("Delete result:", result.data);
      setLecturers((prev) => prev.filter((lec) => lec._id !== id));
    } catch (err) {
      console.error("Failed to delete lecturer:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete lecturer");
      throw err;
    }
  };

  // --- PROJECTS ---
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await axios.get(`${BASE}/api/project`);
      setProjects(res.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

const handleDownload = (materialId, docPublicId, filename) => {
    const url = `https://cec-hub-qme6.vercel.app/api/notification/download-material?id=${materialId}&doc=${encodeURIComponent(docPublicId)}`;
    // Open in new tab to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchNotifications();
    fetchGallery();
    fetchExcos();
    fetchProjects();
    fetchLecturers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = {
    menu,
    setMenu,
    notification,
    setNotification,
    projects,
    setProjects,
    gallery,
    setGallery,
    lecturers,
    excos,
    addExco,
    fetchExcos,
    deleteExco,
    fetchGallery,
    fetchProjects,
    addLecturer,
    fetchLecturers,
    deleteLecturer,
    loadingGallery,
    loadingExcos,
    loadingProjects,
    // newly added helpers
    createGallery,
    updateGallery,
    handleDownload
  };

  return <DeptContext.Provider value={value}>{children}</DeptContext.Provider>;
};

export default DeptContextProvider;
