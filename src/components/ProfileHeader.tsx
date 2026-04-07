import React from "react";
import { Link } from "react-router-dom";
import { User, Edit3 } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  avatarUrl?: string;
  joinedDate: string;
  editLink: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  avatarUrl,
  joinedDate,
  editLink,
}) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
    <div className="flex items-center gap-5">
      <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100 shadow-inner overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <User size={40} />
        )}
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {fullName}
        </h2>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">
          Member since {joinedDate}
        </p>
      </div>
    </div>

    <Link to={editLink}>
      <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">
        <Edit3 size={18} className="text-green-600" />
        Edit Profile
      </button>
    </Link>
  </div>
);

export default ProfileHeader;
