"use client";

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import DonationGrid from '../components/DonationGrid';
import { Loader2 } from "lucide-react";

// Use your env variable or default to localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Browse: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Store the ID for the API and the Name for the UI
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All"); 
  
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.content || []);
      } catch (err: any) {
        console.error("Category Load Error:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Donations whenever the selectedCategoryId changes
  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Build the URL. If "All", fetch all. If ID exists, append query param.
        let url = `${BASE_URL}/api/v1/donations`;
        if (selectedCategoryId !== "All") {
          url += `?categoryId=${selectedCategoryId}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch items`);
        
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.content || [];

        // Map backend response to your frontend DonationItem interface
        const mappedItems = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          location: item.address || "No Location",
          timeAgo: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
          category: item.category?.name || "General",
          imageUrl: item.imageUrls?.[0] || "https://via.placeholder.com/400x300?text=No+Image"
        }));

        setDonations(mappedItems);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [selectedCategoryId]); // Triggered when category changes

  // 3. Local filtering for the Search Bar
  const filteredDonations = donations.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">
          Browse Donations
        </h1>
        <p className="text-gray-500">Find items available for donation in your area.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        {/* Pass ID to the filter so it can trigger the fetch */}
        <CategoryFilter 
          categories={categories} 
          selected={selectedCategoryId} 
          onSelect={(id) => setSelectedCategoryId(id)} 
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-green-600" size={40} />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : filteredDonations.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No items found in this category.</div>
      ) : (
        <DonationGrid items={filteredDonations} />
      )}
    </div>
  );
};

export default Browse;