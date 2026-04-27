"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Check, X, Phone, Package, User } from "lucide-react";

interface RequestItem {
  id: string;
  donationTitle: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requesterName?: string;
  requesterPhone?: string;
}

const NotificationsPage = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(
        "http://localhost:8080/api/v1/requests/received",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const token = Cookies.get("token");

      const res = await fetch(
        `http://localhost:8080/api/v1/requests/${id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        fetchRequests(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User className="text-orange-500" /> Notifications
        </h1>

        {requests.length === 0 ? (
          <p className="text-gray-400 text-center">No incoming requests.</p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="p-5 bg-gray-50 rounded-2xl border mb-4 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                  <Package size={14} />
                  {req.donationTitle}
                </div>

                <p className="font-bold text-gray-800">{req.requesterName}</p>

                {req.status === "APPROVED" && (
                  <a
                    href={`tel:${req.requesterPhone}`}
                    className="text-green-600 text-sm flex items-center gap-1 mt-1"
                  >
                    <Phone size={14} />
                    {req.requesterPhone}
                  </a>
                )}
              </div>

              {req.status === "PENDING" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(req.id, "approve")}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Check size={14} /> Approve
                  </button>

                  <button
                    onClick={() => handleAction(req.id, "reject")}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    req.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
