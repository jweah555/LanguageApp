import "../Header/Header.css";
// import hamIcon from "../../assets/images/hamburgerIcon.png";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";

const NAV_LINKS = [
  { to: "/createCard", label: "Card" },
  { to: "/createDeck", label: "Create" },
  { to: "/userDeck", label: "Decks" },
  { to: "/translate", label: "Translate" },
  { to: "/profile", label: "Profile" },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  const { pathname } = useLocation();
  const closeMenu = () => setIsOpen(false);

  // The header stays mounted across pages, so close the drawer after any navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
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

          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
            className="mobile"
          />

          <button
            className="menu-button"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="side-nav"
          >
            Menu
          </button>
        </div>

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
            <ThemeToggle
              theme={theme}
              onToggle={toggleTheme}
              className="desktop"
            />
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

      {/* Mobile menu: always rendered so it can slide in and out */}
      <div
        className={`side-nav-backdrop ${isOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <nav
        id="side-nav"
        className={`side-nav ${isOpen ? "open" : ""}`}
        aria-label="Main menu"
        inert={!isOpen}
      >
        <div className="side-nav-top">
          {user ? (
            <span className="side-nav-greeting">Hi, {user.firstName}</span>
          ) : (
            <span>Menu</span>
          )}
          <button
            type="button"
            className="side-nav-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul>
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} onClick={closeMenu}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="side-nav-account">
          {user ? (
            <button
              type="button"
              className="side-nav-logout"
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="side-nav-login" onClick={closeMenu}>
                Login
              </Link>
              <Link
                to="/loginSignUp"
                className="side-nav-cta"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
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
