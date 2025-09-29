import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const DeptContext = createContext();

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
      const res = await axios.get("https://cec-hub-qme6.vercel.app/api/exco");
      setExcos(res.data || []);
    } catch (err) {
      console.error("Failed to fetch excos:", err);
      setExcos([]);
    } finally {
      setLoadingExcos(false);
    }
  };

  const addExco = async (formData) => {
    try {
      const res = await axios.post("https://cec-hub-qme6.vercel.app/api/exco", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setExcos((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add exco:", err);
    }
  };

  const deleteExco = async (id) => {
    try {
      await axios.delete(`https://cec-hub-qme6.vercel.app/api/exco/${id}`);
      setExcos((prev) => prev.filter((ex) => ex._id !== id));
    } catch (err) {
      console.error("Failed to delete exco:", err);
    }
  };

  // --- NOTIFICATIONS ---
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("https://cec-hub-qme6.vercel.app/api/notification");
      setNotification(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotification([]);
    }
  };

  // --- GALLERY ---
  const fetchGallery = async () => {
    try {
      const res = await axios.get("https://cec-hub-qme6.vercel.app/api/gallery");
      setGallery(res.data || []);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
      setGallery([]);
    } finally {
      setLoadingGallery(false);
    }
  };

  // --- LECTURERS ---
  const fetchLecturers = async () => {
    try {
      const res = await axios.get("https://cec-hub-qme6.vercel.app/api/lecturer");
      setLecturers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch lecturers:", err);
      setLecturers([]);
    }
  };

  const addLecturer = async (formData) => {
    if (!token) return console.error("No token found, cannot add lecturer");

    try {
      const res = await axios.post(
        "https://cec-hub-qme6.vercel.app/api/lecturer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setLecturers((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error("Failed to add lecturer:", err);
      throw err;
    }
  };

  const deleteLecturer = async (id) => {
    if (!token) return console.error("No token found, cannot delete lecturer");

    try {
      await axios.delete(`https://cec-hub-qme6.vercel.app/api/lecturer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(id)
      
      setLecturers((prev) => prev.filter((lec) => lec._id !== id));
    } catch (err) {
      console.log(err)
      console.error("Failed to delete lecturer:", err);
      throw err;
    }
  };

  // --- PROJECTS ---
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await axios.get("https://cec-hub-qme6.vercel.app/api/project");
      setProjects(res.data || []); // fallback to local projects if API fails
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchGallery();
    fetchExcos();
    fetchProjects();
    fetchLecturers();
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
  };

  return <DeptContext.Provider value={value}>{children}</DeptContext.Provider>;
};

export default DeptContextProvider;
