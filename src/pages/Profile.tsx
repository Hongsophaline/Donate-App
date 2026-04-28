"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { Box, Calendar, Clock, ChevronRight } from "lucide-react";

import StatCard from "../components/StatCard";
import ProfileField from "../components/ProfileField";
import ProfileHeader from "../components/ProfileHeader";

// Accessing the environment variable with a fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const ProfilePage = () => {
  useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return navigate("/signup");

        const headers = { Authorization: `Bearer ${token}` };
        
        // Updated to use the BASE_URL variable
        const [pRes, rRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/auth/profile`, { headers }),
          fetch(`${BASE_URL}/api/v1/requests/received`, { headers }),
        ]);

        if (pRes.ok) {
          const profile = await pRes.json();
          setUserData(profile);
          
          if (rRes.ok) {
            const requests = await rRes.json();
            // Safety check to ensure requests is an array before filtering
            const incomingRequests = Array.isArray(requests) ? requests : (requests.content || []);
            setPendingCount(incomingRequests.filter((r: any) => r.status === "PENDING").length);
          }
        } else if (pRes.status === 401) {
          // If token is invalid/expired, clear and redirect
          Cookies.remove("token");
          navigate("/login");
        }
      } catch (err) {
        console.error("Profile load error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!userData) return null;

  const joinedDate = userData.createdAt 
    ? new Date(userData.createdAt).toLocaleString("en-US", { month: "short", year: "numeric" })
    : "Recently";

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <ProfileHeader
            fullName={userData.fullName}
            avatarUrl={userData.avatarUrl}
            joinedDate={joinedDate}
            editLink="/edit-profile"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 mt-6">
            <StatCard icon={<Box size={22} />} value={userData.donationCount || 0} label="Donations" />
            <div onClick={() => navigate("/notifications")} className="cursor-pointer group">
              <StatCard 
                icon={<Clock size={22} className={pendingCount > 0 ? "text-orange-500 animate-pulse" : ""} />} 
                value={pendingCount} 
                label="Pending for me" 
              />
            </div>
            <StatCard icon={<Calendar size={22} />} value={joinedDate} label="Joined" />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Full Name" value={userData.fullName} />
              <ProfileField label="Phone Number" value={userData.phone} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Email" value={userData.email || "—"} />
              <ProfileField label="Birthday" value={userData.dob || "—"} />
            </div>
          </div>
          
          <button 
            onClick={() => navigate("/notifications")}
            className="w-full mt-8 py-4 bg-orange-50 text-orange-600 rounded-2xl font-bold hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
          >
            Manage All Requests <ChevronRight size={18} />
          </button>

          {/* Optional: Dev indicator to confirm you're using local API */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-300 font-mono uppercase tracking-widest">
              API Connection: {BASE_URL.includes('localhost') ? 'Localhost' : 'Remote'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;