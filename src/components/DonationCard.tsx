import { MapPin, Clock } from "lucide-react";


const DonationCard = ({ item, onOpenRequest }: { item: any; onOpenRequest: (id: string) => void }) => {
  // Logic to match the peach color in your screenshot for specific conditions
  const getBadgeColor = (condition: string) => {
    if (condition === "Like New" || condition === "New") return "bg-[#DEC0B1] text-[#A66E53]";
    return "bg-[#D9D9D9] text-gray-700"; // Default gray for others
  };

  return (
    <div className="bg-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col p-3 border border-gray-200 w-full max-w-sm mx-auto">
      {/* Image Container */}
      <div className="h-56 w-full rounded-xl overflow-hidden mb-4 bg-white">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>

      {/* Info Container */}
      <div className="px-1 flex flex-col gap-3">
        <h3 className="text-gray-900 font-bold text-xl truncate">{item.title}</h3>

        <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-gray-400" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-gray-400" />
            <span>{item.timeAgo}</span>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex items-center justify-between mt-1">
          <span className="bg-[#D9D9D9] text-gray-700 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
            {item.category}
          </span>
          <span className={`${getBadgeColor(item.condition)} px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider`}>
            {item.condition}
          </span>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onOpenRequest(item.id)}
          className="w-full mt-3 py-3 border-2 border-[#C84C0E] text-[#C84C0E] font-bold rounded-xl hover:bg-[#C84C0E] hover:text-white transition-all text-base uppercase tracking-widest"
        >
          Request Item
        </button>
          <button 
  onClick={() => onOpenRequest(item.id)} // This now triggers the Detail Modal in Browse.tsx
  className="text-orange-500 bg-orange-50 px-1 py-3 rounded text-xs font-semibold hover:bg-orange-100 transition-colors"
>
  Read More
</button>
      </div>
    
    </div>
  );
};

export default DonationCard;