"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative w-full text-black">
      <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search items..."
        className="w-full pl-10 pr-4 py-2.5 border rounded-md text-sm"
      />
    </div>
  );
}
