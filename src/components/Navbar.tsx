import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, User, Bell } from "lucide-react";
import logoImg from "../assets/logo.png";
import LanguageSelector from "../components/common/LanguageSelector";

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

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
          {/* Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          {/* User Icons & Sign Up Button Group */}
          <div className="flex items-center gap-1 md:gap-2 ml-2 md:border-l md:pl-4 border-gray-200">
            {/* CHANGED: Notification Icon is now a Link to /notifications */}
            <Link
              to="/notifications"
              className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700 relative"
              title={t("notifications.title")}
            >
              <Bell size={22} />
              {/* Notification Badge */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>

            {/* Profile Icon */}
            <Link
              to="/profile"
              className="p-2 hover:bg-gray-100 rounded-full transition text-gray-700"
              title={t("profile.title")}
            >
              <User size={22} />
            </Link>

            {/* Sign Up Button (Desktop) */}
            <Link
              to="/signup"
              className="hidden md:block bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition shadow-sm ml-2"
            >
              {t("navbar.signUp")}
            </Link>
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

          {/* Mobile-only Notifications link for better UX */}
          <NavLink
            to="/notifications"
            className={navClass}
            onClick={() => setIsOpen(false)}
          >
            {t("notifications.title")}
          </NavLink>

          <div className="h-[1px] bg-gray-100 my-2"></div>

          {/* Mobile Sign Up Button */}
          <Link
            to="/signup"
            className="w-full py-4 text-center bg-green-600 text-white rounded-xl font-bold shadow-md active:scale-95 transition-transform"
            onClick={() => setIsOpen(false)}
          >
            {t("navbar.signUp")}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
