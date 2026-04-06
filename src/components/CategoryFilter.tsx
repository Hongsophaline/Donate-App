"use client";

import { ChevronDown } from "lucide-react";

// ✅ Runtime category object type
export interface Category {
  id: string | number;
  name: string;
}

// Example default categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Clothing" },
  { id: 2, name: "Furniture" },
  { id: 3, name: "Books" },
  { id: 4, name: "Electronics" },
];

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
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className="w-full pl-4 pr-10 py-2.5 border rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-green-200 focus:border-green-500 disabled:bg-gray-100"
      >
        <option value="All">
          {isLoading ? "Loading..." : "All Categories"}
        </option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
