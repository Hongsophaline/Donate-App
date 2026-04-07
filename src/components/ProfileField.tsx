import React from "react";

interface ProfileFieldProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  isTextArea?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  icon,
  isTextArea = false,
}) => (
  <div className="group">
    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">
      {icon && <span className="text-green-500/80">{icon}</span>}
      {label}
    </label>
    <div
      className={`w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-700 text-sm font-medium ${
        isTextArea ? "italic leading-relaxed" : ""
      }`}
    >
      {value || "—"}
    </div>
  </div>
);

export default ProfileField;
