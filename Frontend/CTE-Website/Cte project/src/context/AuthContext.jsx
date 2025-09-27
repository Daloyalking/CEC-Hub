import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);

      // Fetch latest user data with token
      axios
        .get(`http://localhost:4000/api/user/${parsedUser._id}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => setUser(res.data.user))
        .catch((err) => {
          console.error(err);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
