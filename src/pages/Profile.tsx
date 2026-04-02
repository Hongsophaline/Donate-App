import React from "react";
import { useTranslation } from "react-i18next";
import { User, MapPin, Calendar, Box, Mail, Phone, Edit3 } from "lucide-react";

const ProfilePage = () => {
  const { t } = useTranslation();

  // Mock user data - in a real app, this comes from an API or Auth Context
  const userData = {
    name: "Sophaline Hong",
    email: "hong.sophaline@institute.com",
    phone: "+855 70 835 672",
    location: "Phnom Penh, Cambodia",
    bio: "Passionate about helping communities through donations.",
    joinedDate: "Jan 2025",
    donationCount: 12,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t("profile.title")}
          </h1>
          <p className="text-gray-500">{t("profile.subtitle")}</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Top Info Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData.name}
                </h2>
                <p className="text-gray-400 text-sm">
                  {t("profile.memberSince")} {userData.joinedDate}
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              <Edit3 size={16} />
              {t("profile.editBtn")}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <StatCard
              icon={<Box size={20} />}
              value={userData.donationCount}
              label={t("profile.stats.donations")}
            />
            <StatCard
              icon={<MapPin size={20} />}
              value="Phnom Penh"
              label={t("profile.stats.location")}
            />
            <StatCard
              icon={<Calendar size={20} />}
              value={userData.joinedDate}
              label={t("profile.stats.joined")}
            />
          </div>

          {/* Form Fields (Read Only) */}
          <div className="space-y-6">
            <ProfileField
              label={t("profile.labels.fullName")}
              value={userData.name}
              icon={<User size={16} />}
            />
            <ProfileField
              label={t("profile.labels.email")}
              value={userData.email}
              icon={<Mail size={16} />}
            />
            <ProfileField
              label={t("profile.labels.phone")}
              value={userData.phone}
              icon={<Phone size={16} />}
            />
            <ProfileField
              label={t("profile.labels.location")}
              value={userData.location}
              icon={<MapPin size={16} />}
            />
            <ProfileField
              label={t("profile.labels.bio")}
              value={userData.bio}
              isTextArea
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Component
const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) => (
  <div className="bg-green-50/50 p-4 rounded-xl flex flex-col items-center text-center">
    <div className="text-green-600 mb-1">{icon}</div>
    <span className="text-lg font-bold text-gray-900">{value}</span>
    <span className="text-xs text-gray-500 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

// Reusable Field Component
const ProfileField = ({
  label,
  value,
  icon,
  isTextArea = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isTextArea?: boolean;
}) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      {icon && <span className="text-green-600">{icon}</span>}
      {label}
    </label>
    {isTextArea ? (
      <div className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-600 text-sm italic">
        {value}
      </div>
    ) : (
      <div className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 text-sm">
        {value}
      </div>
    )}
  </div>
);

export default ProfilePage;
