import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEnvelope,faDragon,faMoon ,faUser} from '@fortawesome/free-solid-svg-icons'


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
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    alert("logout successfully");
    setUserInfo(null);
  }

  const username = userInfo?.username;
  const blogPostsNum = userInfo?.blogPostsNum || 0; // Assuming userInfo includes a field for blog post count

  return (
    <div className="Navbar">
      <header>
        <Link to="/" className="logo">
          Bloggy<FontAwesomeIcon icon={faDragon} />
        </Link>
        <div className="burger-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          &#9776;
        </div>
        <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
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
                  <Link to="/create">Create new post</Link>
                  
                  <a onClick={logout}>Logout</a>
                </div>
              )}
            </div>
          )}

          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <Link to="/about">About</Link>
          <button onClick={toggleTheme} className="theme-toggle">
          <FontAwesomeIcon icon={faMoon} /> {isDarkTheme ? "Light Mode" : "Dark Mode"}
          </button>
          
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
