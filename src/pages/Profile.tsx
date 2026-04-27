// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useTranslation } from "react-i18next";
// // import Cookies from "js-cookie";
// // import { MapPin, Calendar, Box, Phone, Mail } from "lucide-react";

// // import StatCard from "../components/StatCard";
// // import ProfileField from "../components/ProfileField";
// // import ProfileHeader from "../components/ProfileHeader";

// // interface UserData {
// //   fullName: string;
// //   email: string | null;
// //   phone: string;
// //   avatarUrl?: string;
// //   dob?: string;
// //   createdAt: string;
// //   donationCount?: number;
// // }

// // const ProfilePage = () => {
// //   const { t } = useTranslation();
// //   const navigate = useNavigate();
// //   const [userData, setUserData] = useState<UserData | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       try {
// //         const token = Cookies.get("token");
// //         if (!token) throw new Error("No auth token found.");

// //         const res = await fetch("http://localhost:8080/api/v1/auth/profile", {
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });

// //         if (!res.ok) throw new Error("Failed to fetch profile data");

// //         const data = await res.json();

// //         setUserData({
// //           fullName: data.fullName || "",
// //           email: data.email,
// //           phone: data.phone || "",
// //           avatarUrl: data.avatarUrl,
// //           dob: data.dob,
// //           createdAt: data.createdAt,
// //           donationCount: data.donationCount || 0,
// //         });
// //       } catch (err) {
// //         console.error(err);
// //         navigate("/signup");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProfile();
// //   }, [navigate]);

// //   const handleLogout = () => {
// //     Cookies.remove("token");
// //     navigate("/signup");
// //   };

// //   if (loading)
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         Loading...
// //       </div>
// //     );

// //   if (!userData) return null;

// //   const joinedDate = new Date(userData.createdAt).toLocaleString("en-US", {
// //     month: "short",
// //     year: "numeric",
// //   });

// //   return (
// //     <div className="min-h-screen bg-[#FDFCFB] py-12 px-6">
// //       <div className="max-w-3xl mx-auto">
// //         {/* Header */}
// //         <div className="text-center mb-10">
// //           <h1 className="text-3xl font-bold text-gray-900 mb-1">
// //             {t("profile.title")}
// //           </h1>
// //           <p className="text-gray-500 text-sm">{t("profile.subtitle")}</p>
// //         </div>

// //         {/* Profile Card */}
// //         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
// //           <div className="p-8">
// //             <ProfileHeader
// //               fullName={userData.fullName}
// //               avatarUrl={userData.avatarUrl}
// //               joinedDate={joinedDate}
// //               editLink="/edit-profile"
// //             />

// //             {/* Stats */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
// //               <StatCard
// //                 icon={<Box size={22} />}
// //                 value={userData.donationCount || 0}
// //                 label={t("profile.stats.donations")}
// //               />
// //               <StatCard
// //                 icon={<MapPin size={22} />}
// //                 value={userData.dob || "—"}
// //                 label={t("profile.stats.dob")}
// //               />
// //               <StatCard
// //                 icon={<Calendar size={22} />}
// //                 value={joinedDate}
// //                 label={t("profile.stats.joined")}
// //               />
// //             </div>

// //             {/* Info Fields */}
// //             <div className="space-y-6">
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <ProfileField
// //                   label={t("profile.labels.fullName")}
// //                   value={userData.fullName}
// //                 />
// //                 <ProfileField
// //                   label={t("profile.labels.phone")}
// //                   value={userData.phone}
// //                 />
// //               </div>

// //               <ProfileField
// //                 label={t("profile.labels.email")}
// //                 value={userData.email || "—"}
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Logout */}
// //         <div className="mt-8 text-center">
// //           <p className="text-gray-500 text-sm">
// //             {t("profile.logoutPrompt") || "Want to switch accounts?"}{" "}
// //             <button
// //               onClick={handleLogout}
// //               className="text-red-500 font-bold hover:text-red-600 hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
// //             >
// //               {t("profile.logoutLink") || "Log out"}
// //             </button>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;
// "use client";

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import Cookies from "js-cookie";
// import { MapPin, Calendar, Box, Phone, Mail, User, Check, X, Clock, Send, Package } from "lucide-react"; // Added Package icon

// import StatCard from "../components/StatCard";
// import ProfileField from "../components/ProfileField";
// import ProfileHeader from "../components/ProfileHeader";

// interface RequestItem {
//   id: string;
//   donationTitle: string; // This holds the Product Title
//   status: "PENDING" | "APPROVED" | "REJECTED";
//   createdAt: string;
//   requesterId?: string;
//   requesterName?: string;
//   requesterPhone?: string;
//   donorId?: string;
//   donorName?: string;
//   donorPhone?: string;
// }

// interface UserData {
//   fullName: string;
//   email: string | null;
//   phone: string;
//   avatarUrl?: string;
//   dob?: string;
//   createdAt: string;
//   donationCount?: number;
// }

// const ProfilePage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [receivedRequests, setReceivedRequests] = useState<RequestItem[]>([]);
//   const [myRequests, setMyRequests] = useState<RequestItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAllData = async () => {
//     try {
//       const token = Cookies.get("token");
//       if (!token) {
//         navigate("/signup");
//         return;
//       }

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//       };

//       const [pRes, rRes, mRes] = await Promise.all([
//         fetch("http://localhost:8080/api/v1/auth/profile", { headers }),
//         fetch("http://localhost:8080/api/v1/requests/received", { headers }),
//         fetch("http://localhost:8080/api/v1/requests/my", { headers }),
//       ]);

//       if (!pRes.ok) throw new Error("Failed to fetch profile");

//       const profileData = await pRes.json();
//       setUserData(profileData);
//       setReceivedRequests(rRes.ok ? await rRes.json() : []);
//       setMyRequests(mRes.ok ? await mRes.json() : []);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       navigate("/signup");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async (id: string, action: "approve" | "reject") => {
//     try {
//       const token = Cookies.get("token");
//       const res = await fetch(`http://localhost:8080/api/v1/requests/${id}/${action}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//       });
//       if (res.ok) {
//         fetchAllData();
//       } else {
//         alert(`Failed to ${action} request`);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleLogout = () => {
//     Cookies.remove("token");
//     navigate("/signup");
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, [navigate]);

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       Loading...
//     </div>
//   );

//   if (!userData) return null;

//   const joinedDate = new Date(userData.createdAt).toLocaleString("en-US", {
//     month: "short",
//     year: "numeric",
//   });

//   return (
//     <div className="min-h-screen bg-[#FDFCFB] py-12 px-6">
//       <div className="max-w-3xl mx-auto space-y-8">

//         {/* --- Profile Card --- */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-8">
//             <ProfileHeader
//               fullName={userData.fullName}
//               avatarUrl={userData.avatarUrl}
//               joinedDate={joinedDate}
//               editLink="/edit-profile"
//             />

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 mt-6">
//               <StatCard
//                 icon={<Box size={22} />}
//                 value={userData.donationCount || 0}
//                 label={t("profile.stats.donations")}
//               />
//               <StatCard
//                 icon={<Clock size={22} />}
//                 value={receivedRequests.filter(r => r.status === 'PENDING').length}
//                 label="Pending for me"
//               />
//               <StatCard
//                 icon={<Calendar size={22} />}
//                 value={joinedDate}
//                 label={t("profile.stats.joined")}
//               />
//             </div>

//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <ProfileField label={t("profile.labels.fullName")} value={userData.fullName} />
//                 <ProfileField label={t("profile.labels.phone")} value={userData.phone} />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <ProfileField label={t("profile.labels.email")} value={userData.email || "—"} />
//                 <ProfileField label={t("profile.stats.dob")} value={userData.dob || "—"} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- SECTION: Incoming Requests (Donor View) --- */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <User size={20} className="text-orange-500" />
//             Manage Incoming Requests
//           </h2>

//           {receivedRequests.length === 0 ? (
//             <p className="text-gray-400 text-center py-4">No incoming requests.</p>
//           ) : (
//             receivedRequests.map((req) => (
//               <div key={req.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div className="flex-1">
//                   {/* Product Title Badge - Makes it clear what is being requested */}
//                   <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg mb-2 border border-blue-100">
//                     <Package size={14} />
//                     <span className="text-xs font-bold uppercase tracking-wide">
//                       Item: {req.donationTitle || "Untitled Product"}
//                     </span>
//                   </div>

//                   <h4 className="font-bold text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/profile/${req.requesterId}`)}>
//                     Requested by: {req.requesterName}
//                   </h4>

//                   {req.status === "APPROVED" && (
//                     <div className="flex items-center gap-2 mt-2">
//                       <span className="text-xs text-gray-500">Contact:</span>
//                       <a href={`tel:${req.requesterPhone}`} className="text-green-600 flex items-center gap-1 text-sm font-bold">
//                         <Phone size={14}/> {req.requesterPhone}
//                       </a>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex gap-2 w-full md:w-auto">
//                   {req.status === "PENDING" ? (
//                     <>
//                       <button
//                         onClick={() => handleAction(req.id, "approve")}
//                         className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 hover:bg-green-700 transition-all shadow-sm"
//                       >
//                         <Check size={16}/> Approve
//                       </button>
//                       <button
//                         onClick={() => handleAction(req.id, "reject")}
//                         className="flex-1 md:flex-none bg-white text-red-600 border border-red-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 hover:bg-red-50 transition-all"
//                       >
//                         <X size={16}/> Reject
//                       </button>
//                     </>
//                   ) : (
//                     <span className={`w-full md:w-auto text-center px-4 py-2 rounded-xl text-sm font-black uppercase ${req.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                         {req.status}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* --- SECTION: My Sent Requests (Requester View) --- */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
//           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <Send size={20} className="text-blue-500" /> My Requests Status
//           </h2>
//           {myRequests.length === 0 ? (
//              <p className="text-gray-400 text-center py-4">You haven't requested anything yet.</p>
//           ) : (
//             myRequests.map((req) => (
//               <div key={req.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-4 flex justify-between items-center">
//                 <div>
//                   <h4 className="font-bold text-gray-800 text-lg">{req.donationTitle}</h4>
//                   {req.status === "APPROVED" && (
//                     <div className="mt-2">
//                       <p className="text-xs text-gray-500">Donor: <span className="font-bold text-gray-700">{req.donorName}</span></p>
//                       <a href={`tel:${req.donorPhone}`} className="text-blue-600 text-sm font-bold flex items-center gap-1 mt-1">
//                         <Phone size={14}/> {req.donorPhone}
//                       </a>
//                     </div>
//                   )}
//                 </div>
//                 <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
//                     req.status === "APPROVED" ? "bg-green-100 text-green-700" :
//                     req.status === "REJECTED" ? "bg-red-100 text-red-700" :
//                     "bg-blue-100 text-blue-700"
//                   }`}>
//                   {req.status}
//                 </span>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="mt-8 text-center">
//           <p className="text-gray-500 text-sm">
//             {t("profile.logoutPrompt") || "Want to switch accounts?"}{" "}
//             <button
//               onClick={handleLogout}
//               className="text-red-500 font-bold hover:text-red-600 hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
//             >
//               {t("profile.logoutLink") || "Log out"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import {
  MapPin,
  Calendar,
  Box,
  Phone,
  Mail,
  User,
  Check,
  X,
  Clock,
  Send,
  Package,
} from "lucide-react";

import StatCard from "../components/StatCard";
import ProfileField from "../components/ProfileField";
import ProfileHeader from "../components/ProfileHeader";

interface RequestItem {
  id: string;
  donationTitle: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  requesterId?: string;
  requesterName?: string;
  requesterPhone?: string;
  donorId?: string;
  donorName?: string;
  donorPhone?: string;
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
  const [receivedRequests, setReceivedRequests] = useState<RequestItem[]>([]);
  const [myRequests, setMyRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- API FETCH: ALL DATA ---
  const fetchAllData = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/signup");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch Profile, Incoming Requests, and My Requests in parallel
      const [pRes, rRes, mRes] = await Promise.all([
        fetch("http://localhost:8080/api/v1/auth/profile", { headers }),
        fetch("http://localhost:8080/api/v1/requests/received", { headers }),
        fetch("http://localhost:8080/api/v1/requests/my", { headers }),
      ]);

      if (!pRes.ok) throw new Error("Failed to fetch profile");

      const profileData = await pRes.json();
      setUserData(profileData);
      setReceivedRequests(rRes.ok ? await rRes.json() : []);
      setMyRequests(mRes.ok ? await mRes.json() : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      navigate("/signup");
    } finally {
      setLoading(false);
    }
  };

  // --- API FETCH: APPROVE / REJECT ---
  // This matches your Swagger screenshot: /api/v1/requests/{id}/approve or reject
  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const res = await fetch(
        `http://localhost:8080/api/v1/requests/${id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.ok) {
        // Refresh the list after successful action
        fetchAllData();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error: ${errorData.message || `Failed to ${action} request`}`);
      }
    } catch (err) {
      console.error(`Error during ${action}:`, err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/signup");
  };

  useEffect(() => {
    fetchAllData();
  }, [navigate]);

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
      <div className="max-w-3xl mx-auto space-y-8">
        {/* --- Profile Card --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <ProfileHeader
              fullName={userData.fullName}
              avatarUrl={userData.avatarUrl}
              joinedDate={joinedDate}
              editLink="/edit-profile"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 mt-6">
              <StatCard
                icon={<Box size={22} />}
                value={userData.donationCount || 0}
                label={t("profile.stats.donations")}
              />
              <StatCard
                icon={<Clock size={22} />}
                value={
                  receivedRequests.filter((r) => r.status === "PENDING").length
                }
                label="Pending for me"
              />
              <StatCard
                icon={<Calendar size={22} />}
                value={joinedDate}
                label={t("profile.stats.joined")}
              />
            </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  label={t("profile.labels.email")}
                  value={userData.email || "—"}
                />
                <ProfileField
                  label={t("profile.stats.dob")}
                  value={userData.dob || "—"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Incoming Requests --- */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-orange-500" />
            Manage Incoming Requests
          </h2>

          {receivedRequests.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No incoming requests.
            </p>
          ) : (
            receivedRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg mb-2 border border-blue-100">
                    <Package size={14} />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Item: {req.donationTitle || "Untitled Product"}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-800 text-lg">
                    Requested by: {req.requesterName}
                  </h4>

                  {req.status === "APPROVED" && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Contact:</span>
                      <a
                        href={`tel:${req.requesterPhone}`}
                        className="text-green-600 flex items-center gap-1 text-sm font-bold"
                      >
                        <Phone size={14} /> {req.requesterPhone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {req.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleAction(req.id, "approve")}
                        className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 hover:bg-green-700 transition-all shadow-sm"
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "reject")}
                        className="flex-1 md:flex-none bg-white text-red-600 border border-red-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 hover:bg-red-50 transition-all"
                      >
                        <X size={16} /> Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`w-full md:w-auto text-center px-4 py-2 rounded-xl text-sm font-black uppercase ${req.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- My Requests --- */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Send size={20} className="text-blue-500" /> My Requests Status
          </h2>
          {myRequests.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              You haven't requested anything yet.
            </p>
          ) : (
            myRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">
                    {req.donationTitle}
                  </h4>
                  {req.status === "APPROVED" && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Donor:{" "}
                        <span className="font-bold text-gray-700">
                          {req.donorName}
                        </span>
                      </p>
                      <a
                        href={`tel:${req.donorPhone}`}
                        className="text-blue-600 text-sm font-bold flex items-center gap-1 mt-1"
                      >
                        <Phone size={14} /> {req.donorPhone}
                      </a>
                    </div>
                  )}
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    req.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : req.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>

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
