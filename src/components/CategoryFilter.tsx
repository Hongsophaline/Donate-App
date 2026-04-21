import React from 'react';

interface CategoryFilterProps {
  selected: string;
  onSelect: (val: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => (
  <select 
    value={selected}
    onChange={(e) => onSelect(e.target.value)}
    className="bg-white border border-gray-200 rounded-lg px-6 py-3 shadow-sm outline-none cursor-pointer hover:border-gray-300"
  >
    <option>All Categories</option>
    <option>Clothing</option>
    <option>Furniture</option>
    <option>Books</option>
  </select>
);

export default CategoryFilter;