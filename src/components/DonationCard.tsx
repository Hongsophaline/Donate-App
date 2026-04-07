"use client";

import { useState } from "react";
import { MapPin, Clock, Loader2, CheckCircle } from "lucide-react";

export interface DonationItem {
  id: string; // Changed to string/UUID to match your backend
  title: string;
  location: string;
  time: string;
  category: string;
  condition: string;
  image: string;
}

interface Props {
  item: DonationItem;
}

export default function DonationCard({ item }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to request items");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://material-donation-backend-4.onrender.com/api/v1/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          donationId: item.id,
          message: "I am interested in this item. Thank you!" // You can make this a textarea later
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send request");
      }

      setIsRequested(true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="h-56 w-full bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-md font-semibold text-gray-900 mb-2">
          {item.title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {item.time}
          </span>
        </div>
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">
            {item.category}
          </span>
          <span className={`px-3 py-1 text-xs rounded-full ${
            item.condition === "Like New" ? "bg-orange-100 text-orange-800" : "bg-amber-100 text-amber-800"
          }`}>
            {item.condition}
          </span>
        </div>

        <button 
          onClick={handleRequest}
          disabled={isSubmitting || isRequested}
          className={`mt-auto w-full py-2 flex items-center justify-center gap-2 rounded-md transition-all font-medium ${
            isRequested 
              ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : isRequested ? (
            <>
              <CheckCircle size={16} /> Requested
            </>
          ) : (
            "Request Item"
          )}
        </button>
      </div>
    </div>
  );
}