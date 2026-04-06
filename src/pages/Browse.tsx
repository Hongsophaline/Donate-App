"use client";

import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import DonationGrid from "../components/DonationGrid";
import type { DonationItem } from "../components/DonationCard";
import type { Category } from "../components/CategoryFilter";

// Dummy donation items
const DUMMY_ITEMS: DonationItem[] = [
  {
    id: 1,
    title: "Winter Jacket - Size M",
    location: "Phnom Penh",
    time: "2 hours ago",
    category: "Clothing",
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Wooden Bookshelf",
    location: "Siem Reap",
    time: "5 hours ago",
    category: "Furniture",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Children's Books (Set of 12)",
    location: "Phnom Penh",
    time: "1 hour ago",
    category: "Books",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
];

// Dummy fallback categories
const DUMMY_CATEGORIES: Category[] = [
  { id: "1", name: "Books" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Furniture" },
];

export default function BrowseDonations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          "https://material-donation-backend-3.onrender.com/api/categories",
        );

        if (!res.ok) {
          console.error("Failed to fetch categories, status:", res.status);
          // Fallback to dummy categories
          setCategories(DUMMY_CATEGORIES);
          return;
        }

        const data = await res.json();
        setCategories(
          Array.isArray(data) ? data : data.data || DUMMY_CATEGORIES,
        );
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories(DUMMY_CATEGORIES); // Fallback on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter donation items based on search and category
  const filteredItems = DUMMY_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || item.category === selectedCategory),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <main className="max-w-7xl w-full px-4 py-12 text-center">
        <h1 className="text-3xl font-extrabold mb-6">Browse Donations</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-3xl mx-auto justify-center">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            categories={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            isLoading={isLoading}
          />
        </div>

        <DonationGrid items={filteredItems} />
      </main>
    </div>
  );
}
