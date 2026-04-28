"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { User, Send, Package, Check, X, ArrowLeft } from "lucide-react";

// Accessing the environment variable with a fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface RequestItem {
  id: string;
  donationTitle: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requesterName?: string;
  requesterPhone?: string;
  donorName?: string;
  donorPhone?: string;
}

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [receivedRequests, setReceivedRequests] = useState<RequestItem[]>([]);
  const [myRequests, setMyRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [rRes, mRes] = await Promise.all([
        fetch(`${BASE_URL}/api/v1/requests/received`, { headers }),
        fetch(`${BASE_URL}/api/v1/requests/my`, { headers }),
      ]);

      setReceivedRequests(rRes.ok ? await rRes.json() : []);
      setMyRequests(mRes.ok ? await mRes.json() : []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${BASE_URL}/api/v1/requests/${id}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) fetchData();
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-12 px-6 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold mb-4"
        >
          <ArrowLeft size={20} /> Back to Profile
        </button>

        {/* SECTION 1: INCOMING REQUESTS */}
        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <User size={24} className="text-orange-500" /> Manage Incoming
              Requests
            </h2>
            <span className="text-[10px] font-mono text-gray-300 uppercase">
              {BASE_URL.includes("localhost") ? "Local API" : "Live API"}
            </span>
          </div>

          <div className="space-y-6">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-8 bg-[#F9FAFB] rounded-[24px] border border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div className="flex-1 w-full space-y-2">
                    <div className="inline-flex items-center gap-2 bg-[#E0E7FF] text-[#3730A3] px-4 py-1 rounded-full border border-[#C7D2FE]">
                      <Package size={14} />
                      <span className="text-[11px] font-bold uppercase">
                        ITEM: {req.donationTitle}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">
                      Requested by: {req.requesterName}
                    </h4>

                    {req.status === "APPROVED" && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-gray-400">Contact:</span>
                        <a
                          href={`tel:${req.requesterPhone}`}
                          className="text-green-500 font-bold hover:underline"
                        >
                          {req.requesterPhone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {req.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleAction(req.id, "approve")}
                          className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-600 transition-colors"
                        >
                          <Check size={18} /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "reject")}
                          className="bg-white text-red-500 border border-red-200 px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-50 transition-colors"
                        >
                          <X size={18} /> Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-4 py-1 rounded-lg font-bold text-sm ${req.status === "APPROVED" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                      >
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4 font-medium">
                No incoming requests yet.
              </p>
            )}
          </div>
        </div>

        {/* SECTION 2: MY REQUESTS */}
        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Send size={24} className="text-blue-500" /> My Requests Status
          </h2>

          <div className="space-y-6">
            {myRequests.length > 0 ? (
              myRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-8 bg-[#F9FAFB] rounded-[24px] border border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div className="flex-1 w-full space-y-2">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full border border-blue-100">
                      <Package size={14} />
                      <span className="text-[11px] font-bold uppercase">
                        ITEM: {req.donationTitle}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">
                      Donor: {req.donorName}
                    </h4>

                    {req.status === "APPROVED" && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-gray-400">Contact Donor:</span>
                        <a
                          href={`tel:${req.donorPhone}`}
                          className="text-green-500 font-bold hover:underline"
                        >
                          {req.donorPhone}
                        </a>
                      </div>
                    )}
                  </div>

                  <span
                    className={`px-4 py-1 rounded-lg font-bold text-sm ${
                      req.status === "APPROVED"
                        ? "bg-green-100 text-green-600"
                        : req.status === "REJECTED"
                          ? "bg-red-100 text-red-600"
                          : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4 font-medium">
                You haven't requested anything yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
