import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/store";
import { useUIStore } from "@/shared/model/uiStore";
import { Logo } from "@/shared/ui/Logo/Logo";
import "./Sidebar.scss";

const LinkArrowIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    className="nav-arrow-link">
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GroupChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={`nav-arrow-group ${isOpen ? "open" : ""}`}
    style={{ transition: "transform 0.3s ease" }}>
    <path
      d="M6 9L12 15L18 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Sidebar = () => {
  const { user, logout } = useUserStore();
  const { toggleAiHistory, openAiHistory } = useUIStore(); // <--- Хук UI
  const [isProfileOpen, setIsProfileOpen] = useState(true);

  const isDoctor = user?.roles?.includes("Doctor");
  const profileLink = isDoctor ? "/doctor/me" : "/profile";
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__logo">
        <div className="logo-white-filter">
          <Logo width={160} height={50} />
        </div>
      </div>

      <nav className="app-sidebar__nav">
        {user && (
          <div className="nav-group">
            <div className="nav-group__header" onClick={toggleProfile}>
              <h3 className="nav-group__title">Profile</h3>
              <GroupChevronIcon isOpen={isProfileOpen} />
            </div>

            <div
              className={`nav-group__list ${
                isProfileOpen ? "expanded" : "collapsed"
              }`}>
              <NavLink
                to="/"
                className="nav-item"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    toggleAiHistory();
                  } else {
                    openAiHistory();
                  }
                }}>
                <span>My AI-Chats</span>
                <LinkArrowIcon />
              </NavLink>

              <NavLink to="/chats" className="nav-item">
                <span>Chats with doctors</span>
                <LinkArrowIcon />
              </NavLink>

              <NavLink to="/appointments" className="nav-item">
                <span>My appointments</span>
                <LinkArrowIcon />
              </NavLink>

              <NavLink to={profileLink} className="nav-item">
                <span>My profile</span>
                <LinkArrowIcon />
              </NavLink>

              {isDoctor && (
                <NavLink to="/doctor/schedule" className="nav-item">
                  <span>Manage Schedule</span>
                  <LinkArrowIcon />
                </NavLink>
              )}
            </div>
          </div>
        )}

        <div className="nav-group">
          <NavLink to="/doctors" className="nav-group__single-link">
            Doctors
          </NavLink>
        </div>

        <div className="nav-group">
          <NavLink
            to="/"
            className="nav-group__single-link"
            onClick={openAiHistory}>
            AI-Chat
          </NavLink>
        </div>
      </nav>

      <div className="app-sidebar__footer">
        {user ? (
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        ) : (
          <div className="guest-auth-buttons">
            <Link to="/login" className="guest-auth-btn sign-in">
              Sign In
            </Link>
            <Link to="/register" className="guest-auth-btn register">
              Register
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};