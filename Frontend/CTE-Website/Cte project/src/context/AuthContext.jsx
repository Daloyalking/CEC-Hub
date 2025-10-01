import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutTimer, setLogoutTimer] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);

      scheduleAutoLogout(storedToken);

      // Fetch latest user data with token
      axios
        .get(`https://cec-hub-qme6.vercel.app/api/user/${parsedUser._id}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => setUser(res.data.user))
        .catch((err) => {
          console.error(err);
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
    scheduleAutoLogout(jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  const scheduleAutoLogout = (jwtToken) => {
    try {
      const decoded = jwt_decode(jwtToken);
      const expiryTime = decoded.exp * 1000; // JWT exp in seconds
      const currentTime = Date.now();
      const timeout = expiryTime - currentTime;

      if (timeout > 0) {
        const timer = setTimeout(() => {
          alert("Session expired. You have been logged out.");
          logout();
        }, timeout);
        setLogoutTimer(timer);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  };

  const isHOD = () => user && user.position === "hod";
  const isLecturer = () => user && user.role === "lecturer";
  const isStudent = () => user && user.role === "student";
  const isExco = () => user && user.post && user.post !== "None";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        setUser,
        loading,
        isHOD,
        isLecturer,
        isStudent,
        isExco,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
