"use client";

import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import DonationGrid from "../components/DonationGrid";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { DonationItem } from "../components/DonationCard";

const BASE_URL = "https://material-donation-backend-4.onrender.com";
const ITEMS_PER_PAGE = 10;

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch categories and donations in parallel
        const [catRes, donRes] = await Promise.all([
          fetch(`${BASE_URL}/api/categories`, { headers: getAuthHeader() as any }),
          fetch(`${BASE_URL}/api/v1/donations`, { headers: getAuthHeader() as any }),
        ]);

        // Categories
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : catData.content || []);

        // Donations
        if (!donRes.ok) throw new Error("Failed to fetch donations");
        const donData = await donRes.json();
        const items = Array.isArray(donData) ? donData : donData.content || [];

      // Inside your Browse.tsx fetchData function:
const mappedItems = items.map((item: any) => ({
  id: item.id,
  title: item.title,
  // Fix: Your DB screenshot shows the column is named "address"
  location: item.address || "No Location", 
  time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
  category: item.category?.name || "General",
  condition: item.condition ? item.condition.replace(/_/g, " ") : "Good",
  // Fix: Backend returns a list of imageUrls
  image: item.imageUrls && item.imageUrls.length > 0
    ? item.imageUrls[0]
    : "https://via.placeholder.com/400?text=No+Image",
}));

        setDonations(mappedItems);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

 // Find this section in your Browse.tsx and replace it:
const filteredItems = donations.filter((item) => {
  const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
  
  // FIXED: Ensure we are comparing the category name correctly
  const matchesCategory =
    selectedCategory === "All" || 
    item.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    
  return matchesSearch && matchesCategory;
});

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            categories={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            isLoading={isLoading}
          />
        </div>

        {/* Loading, Error, or Empty States */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-green-600" size={40} />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">No items found.</div>
        ) : (
          <>
            {/* Donation Grid */}
            <DonationGrid items={currentItems} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border rounded hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft />
                </button>
                <span className="font-bold text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded hover:bg-gray-100 disabled:opacity-30 transition-all"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}