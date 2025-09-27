import React, { useContext, useEffect } from 'react';
import './App.css';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Current_Excos from './pages/Current_Excos';
import Lecture_Materials from './pages/Lecture_Materials';
import Other_Materials from './pages/Other_Materials';
import About from './pages/About';
import Login from './pages/Login';
import Past_Projects from './pages/Past_Projects';
import Navbar from './components/Navbar';
import Departmental_Gallery from './pages/Departmental_Gallery';
import LecturalPage from './pages/Lecturers';
import Footer from './pages/Footer';
import Profile from './pages/Profile';
import { AuthContext, AuthProvider } from './context/AuthContext';
import ReminderPage from './pages/ReminderPage';
import PostProjectPage from './pages/PostProjectPage';
import AnnouncementPage from './pages/AnnouncementPage';
import EventPage from './pages/EventPage';
import MaterialPage from './pages/MaterialPage';
import PostGalleryPage from './pages/PostGalleryPage';
import PostLecturerPage from './pages/PostLecturerPage';
import ExcoPage from './pages/ExcoPage';
import PasswordReset from './pages/PasswordReset';

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // scroll to top whenever route changes
  }, [pathname]);

  return null;
};

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ScrollToTop /> {/* Add ScrollToTop here */}
      <div className="pb-20">
        <Navbar />
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Protected pages */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/cec_hub/lecturers" element={<ProtectedRoute><LecturalPage /></ProtectedRoute>} />
        <Route path="/cec_hub/current_excos" element={<ProtectedRoute><Current_Excos /></ProtectedRoute>} />
        <Route path="/material/lecture_material" element={<ProtectedRoute><Lecture_Materials /></ProtectedRoute>} />
        <Route path="/material/other_material" element={<ProtectedRoute><Other_Materials /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/past_projects" element={<ProtectedRoute><Past_Projects /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><Departmental_Gallery /></ProtectedRoute>} />
        <Route path="/reminder" element={<ProtectedRoute><ReminderPage /></ProtectedRoute>} />
        <Route path="/post_project" element={<ProtectedRoute><PostProjectPage /></ProtectedRoute>} />
        <Route path="/announcement" element={<ProtectedRoute><AnnouncementPage /></ProtectedRoute>} />
        <Route path="/event" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
        <Route path="/material" element={<ProtectedRoute><MaterialPage /></ProtectedRoute>} />
        <Route path="/post_gallery" element={<ProtectedRoute><PostGalleryPage /></ProtectedRoute>} />
        <Route path="/post_lecturer" element={<ProtectedRoute><PostLecturerPage /></ProtectedRoute>} />
        <Route path="/post_exco" element={<ProtectedRoute><ExcoPage /></ProtectedRoute>} />
        <Route path="/reset-password/:token" element={<PasswordReset />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
