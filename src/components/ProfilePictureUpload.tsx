import React from "react";
import { Camera } from "lucide-react";

interface ProfilePictureUploadProps {
  src: string;
  onChange?: () => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  src,
  onChange,
}) => (
  <div className="flex flex-col items-center sm:flex-row gap-6 pb-8 border-b border-gray-50">
    <div className="relative">
      <img
        src={src}
        alt="Profile"
        className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
      />
      <button
        type="button"
        onClick={onChange}
        className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-green-700 transition-all hover:scale-110 active:scale-95"
      >
        <Camera size={18} />
      </button>
    </div>
    <div className="text-center sm:text-left">
      <h3 className="font-bold text-gray-800 text-lg">Profile Picture</h3>
      <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">
        400x400px recommended
      </p>
    </div>
  </div>
);

export default ProfilePictureUpload;
