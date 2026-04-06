"use client";

import { MapPin, Clock } from "lucide-react";

export interface DonationItem {
  id: number;
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
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              item.condition === "Like New"
                ? "bg-orange-100 text-orange-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {item.condition}
          </span>
        </div>
        <button className="mt-auto w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
          Request Item
        </button>
      </div>
    </div>
  );
}
