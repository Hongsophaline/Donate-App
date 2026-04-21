"use client";

import React from "react";

/* =========================
   TYPES
========================= */

export interface Category {
  id: string;
  name: string;
}

export interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

/* =========================
   COMPONENT
========================= */

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onSelect,
}) => {
  return (
    <div className="w-full md:w-64">
      <label htmlFor="category-select" className="sr-only">
        Filter by Category
      </label>
      <select
        id="category-select"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-3 bg-white border-2 border-gray-100 rounded-lg text-gray-700 font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          backgroundSize: "1.5em",
        }}
      >
        <option value="All">All Categories</option>
        
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;