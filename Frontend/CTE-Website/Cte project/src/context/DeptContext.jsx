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
const API_URL = "[https://cec-hub-qme6.vercel.app/api](https://cec-hub-qme6.vercel.app/api)";

// --- EXCO ---
const fetchExcos = async () => {
try {
const res = await axios.get(`${API_URL}/exco`);
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
const res = await axios.post(`${API_URL}/exco`, formData, {
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
await axios.delete(`${API_URL}/exco/${id}`);
setExcos((prev) => prev.filter((ex) => ex._id !== id));
} catch (err) {
console.error("Failed to delete exco:", err);
}
};

// --- NOTIFICATIONS ---
const fetchNotifications = async () => {
try {
const res = await axios.get(`${API_URL}/notification`);
setNotification(res.data.notifications || []);
} catch (err) {
console.error("Failed to fetch notifications:", err);
setNotification([]);
}
};

const addAnnouncement = async (formData) => {
try {
const res = await axios.post(`${API_URL}/notification/announcement`, formData, {
headers: {
"Content-Type": "multipart/form-data",
Authorization: `Bearer ${token}`,
},
withCredentials: true,
});
setNotification((prev) => [res.data.announcement, ...prev]);
toast.success("Announcement posted successfully!");
} catch (err) {
console.error("Failed to post announcement:", err);
toast.error(err.response?.data?.message || "Failed to post announcement.");
}
};

const updateAnnouncement = async (id, formData) => {
try {
const res = await axios.put(`${API_URL}/notification/announcement/${id}`, formData, {
headers: {
"Content-Type": "multipart/form-data",
Authorization: `Bearer ${token}`,
},
withCredentials: true,
});
setNotification((prev) =>
prev.map((n) => (n._id === id ? res.data.updatedAnnouncement : n))
);
toast.success("Announcement updated successfully!");
} catch (err) {
console.error("Failed to update announcement:", err);
toast.error(err.response?.data?.message || "Failed to update announcement.");
}
};

// --- GALLERY ---
const fetchGallery = async () => {
try {
const res = await axios.get(`${API_URL}/gallery`);
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
const res = await axios.get(`${API_URL}/lecturer`);
setLecturers(res.data || []);
} catch (err) {
console.error("Failed to fetch lecturers:", err);
setLecturers([]);
}
};

const addLecturer = async (formData) => {
if (!token) return console.error("No token found, cannot add lecturer");

try {
  const res = await axios.post(`${API_URL}/lecturer`, formData, {
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
  throw err;
}

};

const deleteLecturer = async (id) => {
if (!token) {
console.error("No token found, cannot delete lecturer");
return;
}

try {
  await axios.delete(`${API_URL}/lecturer/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  setLecturers((prev) => prev.filter((lec) => lec._id !== id));
} catch (err) {
  console.error("Failed to delete lecturer:", err.response?.data || err.message);
  throw err;
}

};

// --- PROJECTS ---
const fetchProjects = async () => {
setLoadingProjects(true);
try {
const res = await axios.get(`${API_URL}/project`);
setProjects(res.data || []);
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
addAnnouncement,
updateAnnouncement,
loadingGallery,
loadingExcos,
loadingProjects,
};

return <DeptContext.Provider value={value}>{children}</DeptContext.Provider>;
};

export default DeptContextProvider;
