import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <div className="bg-[#F8FAF9] p-5 rounded-2xl flex flex-col items-center text-center border border-gray-50 transition-transform hover:translate-y-[-2px]">
    <div className="text-green-600 mb-2 p-2 bg-white rounded-lg shadow-sm">
      {icon}
    </div>
    <span className="text-xl font-black text-gray-900">{value}</span>
    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">
      {label}
    </span>
  </div>
);

export default StatCard;
