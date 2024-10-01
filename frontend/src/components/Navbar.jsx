import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faDragon, faMoon, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkTheme(true);
      document.body.classList.add("dark-theme");
    }
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkTheme]);

  function toggleTheme() {
    setIsDarkTheme((prevTheme) => !prevTheme);
  }

  useEffect(() => {
    fetch("https://bloggy-97fr.onrender.com/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("https://bloggy-97fr.onrender.com/logout", {
      credentials: "include",
      method: "POST",
    });
    alert("logout successfully");
    setUserInfo(null);
    setIsMenuOpen(false); // Close the burger menu after logout
  }

  const handleMenuClick = () => {
    setIsMenuOpen(false); // Close the burger menu
    setIsProfileDropdownOpen(false); // Close the profile dropdown menu
  };

  const username = userInfo?.username;
  const blogPostsNum = userInfo?.blogPostsNum || 0;

  return (
    <div className="Navbar">
      <header>
        <Link to="/" className="logo">
          Bloggy<FontAwesomeIcon icon={faDragon} />
        </Link>
        <div className="burger-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          &#9776;
        </div>
        <nav className={`nav-menu ${isMenuOpen ? "open" : "close"}`}>
          {username && (
            <div className="profile-dropdown">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="profile-button"
              >
                <FontAwesomeIcon icon={faUser} /> Profile
              </button>
              {isProfileDropdownOpen && (
                <div className="dropdown-menu">
                  <p>{username}</p>
                  <p>Blog Posts: {blogPostsNum}</p>
                  <Link to="/create" onClick={handleMenuClick}>Create new post</Link>
                  <a onClick={logout}>Logout</a>
                </div>
              )}
            </div>
          )}

          {!username && (
            <>
              <Link to="/login" onClick={handleMenuClick}>Login</Link>
              <Link to="/register" onClick={handleMenuClick}>Register</Link>
            </>
          )}
          <Link to="/about" onClick={handleMenuClick}>About</Link>
          <button onClick={toggleTheme} className="theme-toggle">
            <FontAwesomeIcon icon={faMoon} /> {isDarkTheme ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
