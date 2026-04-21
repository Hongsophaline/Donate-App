import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div className="relative flex-grow">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
    <input 
      type="text" 
      placeholder="Search items..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-300 outline-none transition-all"
    />
  </div>
);

export default SearchBar;