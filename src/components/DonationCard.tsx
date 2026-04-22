import React from "react";
import { MapPin, Clock } from "lucide-react";

interface DonationItem {
  id: string;
  title: string;
  location: string;
  timeAgo: string;
  category: string;
  imageUrl: string;
  condition: string;
}

const DonationCard = ({
  item,
  onOpenRequest,
}: {
  item: any;
  onOpenRequest: (id: string) => void;
}) => {
  const getBadgeColor = (condition: string) => {
    if (condition === "Like New" || condition === "New") {
      return "bg-[#FCEEE5] text-[#A34F26]";
    }
    return "bg-gray-100 text-[#6B3A1E]";
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col p-4 border border-gray-100 w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-lg">
      {/* Image Container */}
      <div className="h-52 w-full rounded-2xl overflow-hidden mb-4 bg-gray-50">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Info Container */}
      <div className="flex flex-col gap-3">
        <h3 className="text-md font-semibold text-gray-900 mb-2">
          {item.title}
        </h3>

        <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-[#78C25D]" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-[#78C25D]" />
            <span>{item.timeAgo}</span>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex items-center justify-between mt-1">
          <span className="bg-gray-100 text-[#6B3A1E] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            {item.category}
          </span>
          <span
            className={`${getBadgeColor(item.condition)} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest`}
          >
            {item.condition}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Main Action: Logo Brown */}
          <button
            onClick={() => onOpenRequest(item.id)}
            className="w-full py-3.5 border-2 border-[#A34F26] text-[#A34F26] font-extrabold rounded-xl hover:bg-[#A34F26] hover:text-white transition-all duration-200 text-sm uppercase tracking-widest active:scale-95"
          >
            Request Item
          </button>

          {/* Secondary Action: Read More (Updated Hover) */}
          <button
            onClick={() => onOpenRequest(item.id)}
            className="w-full py-2.5 text-[#78C25D] bg-[#F4FAF0] rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 hover:bg-[#DDF0D5] hover:text-[#5B9C43] active:bg-[#CDE8C1]"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationCard;
