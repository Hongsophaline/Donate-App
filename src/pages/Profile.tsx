import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, MapPin, Calendar, Box, Mail, Phone, Edit3 } from "lucide-react";
import Cookies from "js-cookie";

interface ProfileFieldProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  isTextArea?: boolean;
}

interface UserData {
  fullName: string;
  email: string | null;
  phone: string;
  avatarUrl?: string;
  dob?: string;
  createdAt: string;
  donationCount?: number;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("No auth token found.");

        const res = await fetch(
          "https://material-donation-backend-3.onrender.com/api/v1/auth/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch profile data");

        const data = await res.json();

        setUserData({
          fullName: data.fullName || "",
          email: data.email,
          phone: data.phone || "",
          avatarUrl: data.avatarUrl,
          dob: data.dob,
          createdAt: data.createdAt,
          donationCount: data.donationCount || 0,
        });
      } catch (err) {
        console.error(err);
        navigate("/signup");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/signup");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!userData) return null;

  const joinedDate = new Date(userData.createdAt).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t("profile.title")}
          </h1>
          <p className="text-gray-500 text-sm">{t("profile.subtitle")}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-2 w-full "></div>
          <div className="p-8">
            {/* Top Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100 shadow-inner overflow-hidden">
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    {userData.fullName}
                  </h2>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">
                    {t("profile.memberSince")} {joinedDate}
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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <StatCard
                icon={<Box size={22} />}
                value={userData.donationCount || 0}
                label={t("profile.stats.donations")}
              />
              <StatCard
                icon={<MapPin size={22} />}
                value={userData.dob || "—"}
                label={t("profile.stats.dob")}
              />
              <StatCard
                icon={<Calendar size={22} />}
                value={joinedDate}
                label={t("profile.stats.joined")}
              />
            </div>

            {/* Info Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  label={t("profile.labels.fullName")}
                  value={userData.fullName}
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
                value={userData.email || "—"}
                icon={<Mail size={16} />}
              />
            </div>
          </div>
        </div>

        {/* Logout */}
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
      className={`w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-700 text-sm font-medium ${isTextArea ? "italic leading-relaxed" : ""}`}
    >
      {value || "—"}
    </div>
  </div>
);

export default ProfilePage;
