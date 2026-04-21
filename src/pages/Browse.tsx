import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import DonationGrid from '../components/DonationGrid';

const Browse: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');

  // Mock data - eventually fetched from your VITE_API_URL
  const donations = [
    { id: '1', title: 'Winter Jacket - Camel', location: 'Bungoma', timeAgo: '2 hours ago', category: 'Clothing', imageUrl: 'https://via.placeholder.com/400x300' },
    { id: '2', title: 'Wooden Bookshelf', location: 'Nairobi', timeAgo: '5 hours ago', category: 'Furniture', imageUrl: 'https://via.placeholder.com/400x300' },
    // ... add more
  ];

  const filteredDonations = useMemo(() => {
    return donations.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'All Categories' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, category]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">Browse Donations</h1>
        <p className="text-gray-500">Find items available for donation in your area.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter selected={category} onSelect={setCategory} />
      </div>

      <DonationGrid items={filteredDonations} />
    </div>
  );
};

export default Browse;