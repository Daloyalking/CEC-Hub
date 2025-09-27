import React, { useContext, useState } from "react";
import { DeptContext } from "../context/DeptContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import bottom_arrow from "../assets/bottom_arrow.jpg";
import top_arrow from "../assets/top_arrow.png";
import menu_icon from "../assets/menu_icon.png";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { menu, setMenu } = useContext(DeptContext);
  const { user } = useContext(AuthContext);
  const [cecArrow, setCecArrow] = useState(false);
  const [post, setPost] = useState(false);
  const [materialArrow, setMaterialArrow] = useState(false);
  const navigate = useNavigate();

  // normalize position
  const positionLC = (user?.position ?? user?.post ?? "").toString().toLowerCase();
  const isLecturer = user?.role?.toLowerCase() === "lecturer";
  const isHOD = positionLC === "hod";
  const isPresident = positionLC === "president";
  const isPRO =
    positionLC === "pro" ||
    positionLC.includes("pro") ||
    positionLC.includes("public relations");

  const canSeePosts = isLecturer || isHOD || isPresident || isPRO;
  


  return (
    <nav className="bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 md:px-12 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 md:w-12" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Main Links */}
          <div className="flex items-center gap-4 text-sm font-semibold uppercase">
            <NavLink to="/" className="hover:text-gray-200 transition-colors">
              Home
            </NavLink>
            <NavLink
              to="/notifications"
              className="hover:text-gray-200 transition-colors"
            >
              Notifications
            </NavLink>
          </div>

          {/* CEC Hub */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-semibold uppercase hover:text-gray-200 transition-colors">
              CEC Hub
              <img
                src={cecArrow ? top_arrow : bottom_arrow}
                alt="arrow"
                className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
              />
            </button>
            <ul className="absolute top-[12px] left-0 mt-2 hidden group-hover:flex flex-col bg-white text-gray-700 rounded-md shadow-lg min-w-[180px] py-2">
              <NavLink
                to="/cec_hub/lecturers"
                className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
              >
                Lecturers
              </NavLink>
              <NavLink
                to="/cec_hub/current_excos"
                className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
              >
                Current Excos
              </NavLink>
            </ul>
          </div>

          {/* Materials */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-semibold uppercase hover:text-gray-200 transition-colors">
              Materials
              <img
                src={materialArrow ? top_arrow : bottom_arrow}
                alt="arrow"
                className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
              />
            </button>
            <ul className="absolute top-[12px] left-0 mt-2 hidden group-hover:flex flex-col bg-white text-gray-700 rounded-md shadow-lg min-w-[180px] py-2">
              <NavLink
                to="/material/lecture_material"
                className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
              >
                Lecture Materials
              </NavLink>
              <NavLink
                to="/material/other_material"
                className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
              >
                Other Materials
              </NavLink>
            </ul>
          </div>

          {/* Extra Links */}
          <div className="flex items-center gap-4 text-sm font-semibold uppercase">
            <NavLink
              to="/past_projects"
              className="hover:text-gray-200 transition-colors"
            >
              Past Projects
            </NavLink>
            <NavLink
              to="/gallery"
              className="hover:text-gray-200 transition-colors"
            >
              Gallery
            </NavLink>

            {/* Posts */}
            {canSeePosts && (
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-semibold uppercase hover:text-gray-200 transition-colors">
                  Posts
                  <img
                    src={post ? top_arrow : bottom_arrow}
                    alt="arrow"
                    className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                  />
                </button>
                <ul className="absolute top-[12px] left-0 mt-2 hidden group-hover:flex flex-col bg-white text-gray-700 rounded-md shadow-lg min-w-[200px] py-2">
                  {(isLecturer || isHOD) && (
                    <>
                      <NavLink
                        to="/reminder"
                        className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                      >
                        Reminder
                      </NavLink>
                      <NavLink
                        to="/post_project"
                        className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                      >
                        Project
                      </NavLink>
                      <NavLink
                        to="/material"
                        className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                      >
                        Material
                      </NavLink>
                    </>
                  )}
                  {(isLecturer || isHOD || isPresident || isPRO) && (
                    <>
                      <NavLink
                        to="/announcement"
                        className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                      >
                        Announcement
                      </NavLink>
                      <NavLink
                        to="/event"
                        className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                      >
                        Event
                      </NavLink>
                      <NavLink
                        to="/post_gallery"
                        className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                      >
                        Post Gallery
                      </NavLink>
                    </>
                  )}
                  {(isHOD || isPresident || isPRO) && (
                    <NavLink
                      to="/post_exco"
                      className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                    >
                      Post Exco
                    </NavLink>
                  )}
                  {isHOD && (
                    <NavLink
                      to="/post_lecturer"
                      className="px-4 py-2 hover:bg-purple-100 hover:text-purple-700 transition"
                    >
                      Post Lecturer
                    </NavLink>
                  )}
                </ul>
              </div>
            )}

            <NavLink
              to="/about"
              className="hover:text-gray-200 transition-colors"
            >
              About
            </NavLink>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div
              className="flex items-center gap-2 cursor-pointer border-2 border-white rounded-full p-1 hover:scale-105 transition-transform"
              onClick={() => navigate("/profile")}
            >
              <img
                src={user?.picture ? `http://localhost:4000/${user.picture}` : ""}
                alt={user.name || "Profile"}
                className="w-10 h-10 rounded-full"
              />
              <span className="hidden md:block text-sm font-medium">
                {user.name}
              </span>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="hidden md:block px-4 py-2 bg-white text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition"
            >
              Login
            </NavLink>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMenu(true)}
            className="md:hidden focus:outline-none"
          >
            <img src={menu_icon} alt="Menu" className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full overflow-y-auto bg-gradient-to-b from-purple-600 to-indigo-700 text-white z-50 transform ${
          menu ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-full md:hidden`}
      >
        <div className="p-6 flex flex-col min-h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl">Menu</h2>
            <button
              onClick={() => setMenu(false)}
              className="text-white font-bold text-2xl"
            >
              ×
            </button>
          </div>

          {/* Links */}
          <div className="flex-1">
            <NavLink
              onClick={() => setMenu(false)}
              className="block py-3 border-b border-white/20"
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setMenu(false)}
              className="block py-3 border-b border-white/20"
              to="/notifications"
            >
              Notifications
            </NavLink>

            {/* CEC Hub */}
            <div className="py-3 border-b border-white/20">
              <p className="uppercase font-medium mb-2">CEC Hub</p>
              <NavLink
                onClick={() => setMenu(false)}
                className="block py-2 pl-4 hover:text-purple-300 transition"
                to="/cec_hub/lecturers"
              >
                Lecturers
              </NavLink>
              <NavLink
                onClick={() => setMenu(false)}
                className="block py-2 pl-4 hover:text-purple-300 transition"
                to="/cec_hub/current_excos"
              >
                Current Excos
              </NavLink>
            </div>

            {/* Materials */}
            <div className="py-3 border-b border-white/20">
              <p className="uppercase font-medium mb-2">Materials</p>
              <NavLink
                onClick={() => setMenu(false)}
                className="block py-2 pl-4 hover:text-purple-300 transition"
                to="/material/lecture_material"
              >
                Lecture Materials
              </NavLink>
              <NavLink
                onClick={() => setMenu(false)}
                className="block py-2 pl-4 hover:text-purple-300 transition"
                to="/material/other_material"
              >
                Other Materials
              </NavLink>
            </div>

            <NavLink
              onClick={() => setMenu(false)}
              className="block py-3 border-b border-white/20"
              to="/past_projects"
            >
              Past Projects
            </NavLink>
            <NavLink
              onClick={() => setMenu(false)}
              className="block py-3 border-b border-white/20"
              to="/gallery"
            >
              Gallery
            </NavLink>

            {/* Posts */}
            {canSeePosts && (
              <div className="py-3 border-b border-white/20">
                <p className="uppercase font-medium mb-2">Posts</p>
                {(isLecturer || isHOD) && (
                  <>
                    <NavLink
                      onClick={() => setMenu(false)}
                      className="block py-2 pl-4 hover:text-purple-300 transition"
                      to="/reminder"
                    >
                      Reminder
                    </NavLink>
                    <NavLink
                      onClick={() => setMenu(false)}
                      className="block py-2 pl-4 hover:text-purple-300 transition"
                      to="/post_project"
                    >
                      Project
                    </NavLink>
                    <NavLink
                      onClick={() => setMenu(false)}
                      className="block py-2 pl-4 hover:text-purple-300 transition"
                      to="/material"
                    >
                      Material
                    </NavLink>
                  </>
                )}
                {(isLecturer || isHOD || isPresident || isPRO) && (
                  <>
                    <NavLink
                      onClick={() => setMenu(false)}
                      className="block py-2 pl-4 hover:text-purple-300 transition"
                      to="/announcement"
                    >
                      Announcement
                    </NavLink>
                    <NavLink
                      onClick={() => setMenu(false)}
                      className="block py-2 pl-4 hover:text-purple-300 transition"
                      to="/event"
                    >
                      Event
                    </NavLink>
                    <NavLink
                      onClick={() => setMenu(false)}
                      className="block py-2 pl-4 hover:text-purple-300 transition"
                      to="/post_gallery"
                    >
                      Post Gallery
                    </NavLink>
                  </>
                )}
                {(isHOD || isPresident || isPRO) && (
                  <NavLink
                    onClick={() => setMenu(false)}
                    className="block py-2 pl-4 hover:text-purple-300 transition"
                    to="/post_exco"
                  >
                    Post Exco
                  </NavLink>
                )}
                {isHOD && (
                  <NavLink
                    onClick={() => setMenu(false)}
                    className="block py-2 pl-4 hover:text-purple-300 transition"
                    to="/post_lecturer"
                  >
                    Post Lecturer
                  </NavLink>
                )}
              </div>
            )}

            <NavLink
              onClick={() => setMenu(false)}
              className="block py-3 border-b border-white/20"
              to="/about"
            >
              About
            </NavLink>
          </div>

          {/* User */}
          {user ? (
            <div
              className="flex items-center gap-3 mt-6 cursor-pointer"
              onClick={() => {
                setMenu(false);
                navigate("/profile");
              }}
            >
              <img
               src={user?.picture ? `http://localhost:4000/${user.picture}` : ""}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <span className="font-medium">{user.name}</span>
            </div>
          ) : (
            <NavLink
              onClick={() => setMenu(false)}
              className="block mt-6 px-4 py-2 bg-white text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition"
              to="/login"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
