import "../Header/Header.css";
// import hamIcon from "../../assets/images/hamburgerIcon.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
// import { useLocation } from "react-router-dom";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  // const isLoginSignUpPage = location.pathname ==

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header>
      <div>
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="170"
            height="80"
            viewBox="0 0 400 150"
          >
            <path
              d="M30,20 h110 a20,20 0 0 1 20,20 v60 a20,20 0 0 1 -20,20 h-70 l-30,30 v-30 h-10 a20,20 0 0 1 -20,-20 v-60 a20,20 0 0 1 20,-20 z"
              fill="#2196f3"
            />

            <circle cx="65" cy="65" r="6.5" fill="white" />
            <circle cx="90" cy="65" r="6.5" fill="white" />
            <circle cx="115" cy="65" r="6.5" fill="white" />

            <text
              x="160"
              y="90"
              font-family="Montserrat, Arial, sans-serif"
              font-size="60"
              font-weight="bold"
              fill="#1e1e1e"
            >
              Deci
            </text>
          </svg>
        </Link>

        <ThemeToggle theme={theme} onToggle={toggleTheme} className="mobile" />

        <button onClick={() => setIsOpen(!isOpen)}>
          {/* <img
            // className="ham-Icon"
            src={hamIcon}
          /> */}
          Menu
        </button>
      </div>

      {isOpen && (
        <nav className="sub-nav">
          <ul>
            <Link to="/createCard">
              <li>Card</li>
            </Link>

            <Link to="/createDeck">
              <li>Create</li>
            </Link>

            <Link to="/userDeck">
              <li>Decks</li>
            </Link>

            <Link to="/translate">
              <li>Translate</li>
            </Link>

            <li>Profile</li>
            {user ? (
              <li onClick={handleLogout}>Logout</li>
            ) : (
              <>
                <Link to="/login">
                  <li>Login</li>
                </Link>
                <Link to="/loginSignUp">
                  <li>Get Started</li>
                </Link>
              </>
            )}
          </ul>
        </nav>
      )}

      <ul className="main-option">
        <Link to="/createCard">
          <li>Card</li>
        </Link>
        <Link to="/createDeck">
          <li>Create</li>
        </Link>

        <Link to="/userDeck">
          <li>Decks</li>
        </Link>
        <Link to="/translate">
          <li>Translate</li>
        </Link>
        <Link to="/profile">
          <li>Profile</li>
        </Link>
      </ul>
      <ul>
        <li className="theme-toggle-item">
          <ThemeToggle theme={theme} onToggle={toggleTheme} className="desktop" />
        </li>
        {user ? (
          <>
            <li className="welcome">Hi, {user.firstName}</li>
            <li className="login" onClick={handleLogout}>
              Logout
            </li>
          </>
        ) : (
          <>
            <Link to="/login">
              <li className="login">Login</li>
            </Link>
            <Link to="/loginSignUp">
              <li className="getStarted">Get Started</li>
            </Link>
          </>
        )}
      </ul>
    </header>
  );
}

function ThemeToggle({ theme, onToggle, className }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export default Header;
