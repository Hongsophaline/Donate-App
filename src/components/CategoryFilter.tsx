"use client";
import { ChevronDown } from "lucide-react";

interface Category {
  id: string | number;
  name: string;
}

interface Props {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export default function CategoryFilter({
  categories,
  value,
  onChange,
  isLoading,
}: Props) {
  return (
    <div className="relative w-full text-black">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)} // This sends cat.name to setSelectedCategory
        disabled={isLoading}
        className="w-full pl-4 pr-10 py-2.5 border rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:border-green-500 disabled:bg-gray-100"
      >
        <option value="All">
          {isLoading ? "Loading..." : "All Categories"}
        </option>
        {categories.map((cat) => (
          // FIXED: Value must be cat.name to match the item.category.name in Browse.tsx
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
 
