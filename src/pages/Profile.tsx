import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { MapPin, Calendar, Box, Phone, Mail } from "lucide-react";

import StatCard from "../components/StatCard";
import ProfileField from "../components/ProfileField";
import ProfileHeader from "../components/ProfileHeader";

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

        const res = await fetch("http://localhost:8080/api/v1/auth/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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
          <div className="p-8">
            <ProfileHeader
              fullName={userData.fullName}
              avatarUrl={userData.avatarUrl}
              joinedDate={joinedDate}
              editLink="/edit-profile"
            />

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
                />
                <ProfileField
                  label={t("profile.labels.phone")}
                  value={userData.phone}
                />
              </div>

              <ProfileField
                label={t("profile.labels.email")}
                value={userData.email || "—"}
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

export default ProfilePage;