"use client";

import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import DonationGrid from "../components/DonationGrid";
import type { DonationItem } from "../components/DonationCard";
import type { Category } from "../components/CategoryFilter";

export default function BrowseDonations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetching both endpoints
        const [catRes, donRes] = await Promise.all([
          fetch("https://material-donation-backend-3.onrender.com/api/categories"),
          fetch("https://material-donation-backend-3.onrender.com/api/v1/donations")
        ]);

        if (!catRes.ok || !donRes.ok) {
          throw new Error(`Server responded with error: ${donRes.status}`);
        }

        const catData = await catRes.json();
        const donData = await donRes.json();

        // 1. Handle Categories
        const finalCats = Array.isArray(catData) ? catData : (catData.data || []);
        setCategories(finalCats);

        // 2. Handle Donations & Map to Component Props
        // Check if data is nested inside a 'data' property (common in Express/Mongoose)
        const rawDonations = Array.isArray(donData) ? donData : (donData.data || []);
        
        const formattedDonations: DonationItem[] = rawDonations.map((item: any) => ({
          id: item._id || item.id, // Support both MongoDB _id and standard id
          title: item.title || "Untitled",
          location: item.location || "Cambodia",
          time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
          category: typeof item.category === 'object' ? item.category.name : (item.category || "General"),
          condition: item.condition || "Good",
          image: item.images?.[0] || item.image || "https://via.placeholder.com/400",
        }));

        setDonations(formattedDonations);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError("Could not load donations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = donations.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold mb-6 text-center">Browse Donations</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-3xl mx-auto justify-center">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            categories={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            isLoading={isLoading}
          />
        </div>

        {/* Status Handling UI */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-500">Connecting to server...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 font-semibold mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm text-blue-600 underline"
            >
              Try Refreshing
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No items found matching your criteria.</p>
        ) : (
          <DonationGrid items={filteredItems} />
        )}
      </main>
    </div>
  );
}