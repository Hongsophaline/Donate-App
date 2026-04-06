"use client";

import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import DonationGrid from "../components/DonationGrid";
import { AlertCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { DonationItem } from "../components/DonationCard";

const BASE_URL = "https://material-donation-backend-3.onrender.com";
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
    return token ? { "Authorization": `Bearer ${token}` } : undefined;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch Categories from the correct endpoint with Auth
        const catRes = await fetch(`${BASE_URL}/api/categories`, { 
          headers: getAuthHeader() 
        });
        const catData = await catRes.json();
        const catList = Array.isArray(catData) ? catData : (catData.content || []);
        setCategories(catList);

        // 2. Fetch Donations
        const donRes = await fetch(`${BASE_URL}/api/v1/donations`, { 
          headers: getAuthHeader() 
        });
        
        if (!donRes.ok) throw new Error("Failed to fetch donations");
        
        const donData = await donRes.json();
        const items = Array.isArray(donData) ? donData : (donData.content || []);

        const mappedItems = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          location: item.location || "Unknown",
          time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
          category: item.category?.name || "General", 
          condition: item.condition ? item.condition.replace(/_/g, " ") : "Good",
          image: item.images?.[0]?.url || "https://images.unsplash.com/photo-1532622722190-68a516930ee0?w=400",
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

  const filteredItems = donations.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    // Normalize strings for comparison to avoid "No items found" due to casing
    const matchesCategory = 
      selectedCategory === "All" || 
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            categories={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            isLoading={isLoading}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600" /></div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No items found matching "{selectedCategory}"
          </div>
        ) : (
          <>
            <DonationGrid items={currentItems} />
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-2 border rounded disabled:opacity-30"><ChevronLeft /></button>
                <span className="font-bold">{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-2 border rounded disabled:opacity-30"><ChevronRight /></button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}