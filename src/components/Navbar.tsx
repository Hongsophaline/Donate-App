import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, User, Bell, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import logoImg from "../assets/logo.png";
import LanguageSelector from "../components/common/LanguageSelector";

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); // Used to trigger a re-check when navigating
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in based on cookie presence
  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, [location]); // Re-run check whenever the URL changes

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate("/login");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-green-300 text-black px-4 py-2 rounded-lg transition font-semibold"
      : "px-4 py-2 hover:bg-gray-100 rounded-lg transition";

  const paths = ["/", "/donate", "/browse", "/how-it-works", "/contact"];
  const labels = ["home", "donate", "browse", "howItWorks", "contact"];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-10 py-2">
        {/* 1. Logo */}
        <Link to="/">
          <img
            src={logoImg}
            alt="Logo"
            className="w-[90px] h-[70px] object-contain"
          />
        </Link>

        {/* 2. Center Navigation Links (Desktop) */}
        <div className="hidden md:flex gap-1 lg:gap-3 font-medium text-gray-700">
          {paths.map((path, i) => (
            <NavLink key={i} to={path} className={navClass}>
              {t(`navbar.${labels[i]}`)}
            </NavLink>
          ))}
        </div>

        {/* 3. Right Side Actions */}
        <div className="flex items-center gap-1 md:gap-3">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          <div className="flex items-center gap-1 md:gap-2 ml-2 md:border-l md:pl-4 border-gray-200">
            {/* Show Bell and Profile ONLY if logged in */}
            {isLoggedIn && (
              <>
                <Link
                  to="/notifications"
                  className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700 relative"
                  title={t("notifications.title")}
                >
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Link>

                <Link
                  to="/profile"
                  className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700"
                  title={t("profile.title")}
                >
                  <User size={22} />
                </Link>
              </>
            )}

            {/* Switch between Sign Up and Logout */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition shadow-sm ml-2"
              >
                <LogOut size={18} />
                {t("profile.logoutLink") || "Logout"}
              </button>
            ) : (
              <Link
                to="/signup"
                className="hidden md:block bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition shadow-sm ml-2"
              >
                {t("navbar.signUp")}
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center ml-1">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 gap-4 font-medium text-gray-700">
          {paths.map((path, i) => (
            <NavLink
              key={i}
              to={path}
              className={navClass}
              onClick={() => setIsOpen(false)}
            >
              {t(`navbar.${labels[i]}`)}
            </NavLink>
          ))}

          {/* Mobile conditional links */}
          {isLoggedIn ? (
            <>
              <NavLink
                to="/profile"
                className={navClass}
                onClick={() => setIsOpen(false)}
              >
                {t("profile.title")}
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full py-4 text-center bg-red-50 text-red-600 rounded-xl font-bold active:scale-95 transition-transform"
              >
                {t("profile.logoutLink") || "Logout"}
              </button>
            </>
          ) : (
            <Link
              to="/signup"
              className="w-full py-4 text-center bg-green-600 text-white rounded-xl font-bold shadow-md active:scale-95 transition-transform"
              onClick={() => setIsOpen(false)}
            >
              {t("navbar.signUp")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
