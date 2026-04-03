import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, MapPin, Calendar, Box, Mail, Phone, Edit3 } from "lucide-react";

/**
 * Interface for ProfileField Props
 */
interface ProfileFieldProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  isTextArea?: boolean;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const userData = {
    name: "Sophaline Hong",
    email: "hong.sophaline@institute.com",
    phone: "+855 70 835 672",
    location: "Phnom Penh, Cambodia",
    bio: "Passionate about helping communities through donations. I believe small acts of kindness can change the world.",
    joinedDate: "Mar 2026",
    donationCount: 12,
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic: Clear your tokens/auth state here
    // Example: localStorage.removeItem("userToken");

    console.log("User logged out");

    // Redirecting to Sign Up page
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t("profile.title")}
          </h1>
          <p className="text-gray-500 text-sm">{t("profile.subtitle")}</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-2 w-full "></div>

          <div className="p-8">
            {/* Top Info Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100 shadow-inner">
                  <User size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    {userData.name}
                  </h2>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">
                    {t("profile.memberSince")} {userData.joinedDate}
                  </p>
                </div>
              </div>

              <Link to="/edit-profile">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">
                  <Edit3 size={18} className="text-green-600" />
                  {t("profile.editBtn")}
                </button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <StatCard
                icon={<Box size={22} />}
                value={userData.donationCount}
                label={t("profile.stats.donations")}
              />
              <StatCard
                icon={<MapPin size={22} />}
                value="Phnom Penh"
                label={t("profile.stats.location")}
              />
              <StatCard
                icon={<Calendar size={22} />}
                value={userData.joinedDate}
                label={t("profile.stats.joined")}
              />
            </div>

            {/* Information Rows */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  label={t("profile.labels.fullName")}
                  value={userData.name}
                  icon={<User size={16} />}
                />
                <ProfileField
                  label={t("profile.labels.phone")}
                  value={userData.phone}
                  icon={<Phone size={16} />}
                />
              </div>
              <ProfileField
                label={t("profile.labels.email")}
                value={userData.email}
                icon={<Mail size={16} />}
              />
              <ProfileField
                label={t("profile.labels.location")}
                value={userData.location}
                icon={<MapPin size={16} />}
              />
              <ProfileField
                label={t("profile.labels.bio")}
                value={userData.bio}
                isTextArea={true}
              />
            </div>
          </div>
        </div>

        {/* LOGOUT OUTSIDE THE BOX */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {t("profile.logoutPrompt") || "Want to switch accounts?"}{" "}
            <button
              onClick={handleLogout}
              className="text-red-500 font-bold hover:text-red-600 hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
            >
              {t("profile.logoutLink") || "Log out"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- Internal Components --- */

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) => (
  <div className="bg-[#F8FAF9] p-5 rounded-2xl flex flex-col items-center text-center border border-gray-50 transition-transform hover:translate-y-[-2px]">
    <div className="text-green-600 mb-2 p-2 bg-white rounded-lg shadow-sm">
      {icon}
    </div>
    <span className="text-xl font-black text-gray-900">{value}</span>
    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">
      {label}
    </span>
  </div>
);

const ProfileField = ({
  label,
  value,
  icon,
  isTextArea = false,
}: ProfileFieldProps) => (
  <div className="group">
    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">
      {icon && <span className="text-green-500/80">{icon}</span>}
      {label}
    </label>
    <div
      className={`w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-700 text-sm font-medium ${
        isTextArea ? "italic leading-relaxed" : ""
      }`}
    >
      {value || "—"}
    </div>
  </div>
);

export default ProfilePage;
