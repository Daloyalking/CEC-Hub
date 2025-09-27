import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { DeptContext } from "../context/DeptContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReminderPage = () => {
  const { user } = useContext(AuthContext); // Lecturer info
  const { notification, setNotification } = useContext(DeptContext); // Notifications state
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [level, setLevel] = useState("ND1"); // default selected level
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "lecturer") {
    return (
      <div className="p-8 text-center text-red-600">
        You must be logged in as a Lecturer to view this page.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !details) {
      toast.error("Title and details are required!");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:4000/api/notification/reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // attach token
        },
        body: JSON.stringify({ title, details, level }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to create reminder");
        return;
      }

      // Update context with new reminder
      const newReminder = {
        ...data.notification,
        postedBy: {
          name: user.name,
          image: user.picture,
        },
      };

      setNotification([newReminder, ...notification]);

      toast.success("Reminder created successfully!");

      // Reset form
      setTitle("");
      setDetails("");
      setLevel("ND1");
    } catch (error) {
      console.error("Error submitting reminder:", error);
      toast.error("Something went wrong while creating the reminder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold mb-6">Create a New Reminder</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter reminder title"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter reminder details"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">ALL</option>
            <option value="ND1">ND1</option>
            <option value="ND2">ND2</option>
            <option value="HND1">HND1</option>
            <option value="HND2">HND2</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Reminder"}
        </button>
      </form>
    </div>
  );
};

export default ReminderPage;
