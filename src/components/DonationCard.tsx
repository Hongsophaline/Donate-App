import React from 'react';
// If using Lucide or FontAwesome for icons, import them here. 
// Otherwise, we use standard emojis/SVG to match the design.

interface DonationItem {
  id: string;
  title: string;
  location: string;
  timeAgo: string;
  category: string;
  imageUrl: string;
}

interface DonationCardProps {
  item: DonationItem;
}

const DonationCard: React.FC<DonationCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      {/* 1. Image Section */}
      <div className="h-48 w-full bg-gray-100">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Content Section */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-gray-800 font-bold text-lg leading-tight">
          {item.title}
        </h3>

        {/* Location and Time (Metadata Row) */}
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <span>📍</span> <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🕒</span> <span>{item.timeAgo}</span>
          </div>
        </div>

        {/* Category Tag and View Details Link */}
        <div className="flex items-center justify-between mt-1">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
            {item.category}
          </span>
          <button className="text-orange-500 bg-orange-50 px-3 py-1 rounded text-xs font-semibold hover:bg-orange-100 transition-colors">
            View Details
          </button>
        </div>

        {/* Primary Action Button */}
        <button className="w-full mt-2 py-2.5 border-2 border-orange-200 text-orange-700 text-sm font-bold rounded-md hover:bg-orange-50 transition-all active:scale-[0.98]">
          Request Item
        </button>
      </div>
    </div>
  );
};

export default DonationCard;