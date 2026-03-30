import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import logoImg from "../assets/logo.png";
import LanguageSelector from "../components/common/LanguageSelector";

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-green-300 text-black px-4 py-2 rounded-lg transition"
      : "px-4 py-2 hover:bg-gray-100 rounded-lg transition";

  const paths = ["/", "/donate", "/browse", "/how-it-works", "/contact"];
  const labels = ["home", "donate", "browse", "howItWorks", "contact"];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-10 py-2">
        {/* Logo */}
        <Link to="/">
          <img src={logoImg} alt="Logo" className="w-[90px] h-[70px]" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 font-medium text-gray-700">
          {paths.map((path, i) => (
            <NavLink key={i} to={path} className={navClass}>
              {t(`navbar.${labels[i]}`)}
            </NavLink>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="hidden md:block">
            <LanguageSelector />
          </div>

          {/* Desktop Login & Signup */}
          <div className="hidden md:flex gap-2">
            <Link
              to="/login"
              className="px-4 py-2 hover:bg-green-300 rounded-lg transition"
            >
              {t("navbar.login")}
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {t("navbar.signUp")}
            </Link>
          </div>

          {/* Mobile Login */}
          <div className="md:hidden">
            <Link
              to="/login"
              className="px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              {t("navbar.login")}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center ml-2">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Links Only) */}
      <div
        className={`md:hidden bg-white border-t shadow-sm transition-all duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col px-4 py-2 gap-2 font-medium text-gray-700">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
