import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Camera, Check, ArrowLeft } from "lucide-react";
import Cookies from "js-cookie";

const EditProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    profilePic: "",
    location: "Phnom Penh, Cambodia", // Placeholder mapping
    bio: "I love sharing and helping the community. Looking forward to donating more!", // Placeholder mapping
  });

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return;
        const res = await fetch(
          "https://material-donation-backend-4.onrender.com/api/v1/auth/profile",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          fullName: data.fullName || "",
          phone: data.phone || "",
          profilePic: data.avatarUrl || "https://via.placeholder.com/150",
        }));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(
        "https://material-donation-backend-4.onrender.com/api/v1/auth/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            phone: formData.phone,
            avatarUrl: formData.profilePic,
          }),
        },
      );

      if (!res.ok) throw new Error("Update failed");

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-bold text-sm">
            {t("editProfile.backToProfile")}
          </span>
        </button>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 pb-2">
              <div className="relative">
                <img
                  src={formData.profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-gray-100"
                />
                <label className="absolute -bottom-2 -right-2 bg-[#00B14F] text-white p-2 rounded-xl cursor-pointer shadow-lg hover:scale-105 transition-transform">
                  <Camera size={18} />
                  <input type="file" className="hidden" />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {t("editProfile.profilePicture")}
                </h2>
                <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                  JPG, PNG OR GIF • MAX 2MB
                </p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
                  {t("editProfile.fullName")}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#F8F9FB] border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-green-500/20 focus:border-[#00B14F] outline-none transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
                  {t("editProfile.phoneNumber")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#F8F9FB] border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-green-500/20 focus:border-[#00B14F] outline-none transition-all"
                />
              </div>

              {/* Location (Full Width) */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
                  {t("editProfile.location")}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#F8F9FB] border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-green-500/20 focus:border-[#00B14F] outline-none transition-all"
                />
              </div>

              {/* Short Bio (Full Width) */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
                  {t("editProfile.shortBio")}
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#F8F9FB] border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-green-500/20 focus:border-[#00B14F] outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-[2] bg-[#00B14F] text-white font-bold py-4 rounded-2xl hover:bg-[#009643] shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
              >
                {t("editProfile.saveChanges")}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 bg-gray-50 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98]"
              >
                {t("editProfile.cancel")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <Check size={18} strokeWidth={3} className="text-green-400" />
          <p className="font-bold text-sm">{t("editProfile.success")}</p>
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl">
          <p className="font-bold text-sm">{t("editProfile.error")}</p>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
