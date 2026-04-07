"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, MapPin, Clock, ChevronDown } from "lucide-react";

interface DonationItem {
  id: number;
  title: string;
  location: string;
  time: string;
  category: string;
  condition: string;
  image: string;
}

// Mock data
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
  {
    id: 4,
    title: "Winter Jacket - Size M",
    location: "Phnom Penh",
    time: "2 hours ago",
    category: "Clothing",
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    title: "Wooden Bookshelf",
    location: "Siem Reap",
    time: "5 hours ago",
    category: "Furniture",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 6,
    title: "Children's Books (Set of 12)",
    location: "Phnom Penh",
    time: "1 hour ago",
    category: "Books",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
];

export default function BrowseDonations() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter logic
  const filteredItems = DUMMY_ITEMS.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            {t("browse.title", "Browse Donations")}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {t(
              "browse.subtitle",
              "Find items available for donation in your area.",
            )}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 max-w-3xl mx-auto">
          <div className="relative w-full sm:w-2/3">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("browse.searchPlaceholder", "Search items...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-200 focus:border-green-500"
            />
          </div>

          <div className="relative w-full sm:w-1/3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-md bg-white text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-green-200 focus:border-green-500"
            >
              <option value="All">
                {t("browse.allCategories", "All Categories")}
              </option>
              <option value="Clothing">
                {t("browse.categories.clothing", "Clothing")}
              </option>
              <option value="Furniture">
                {t("browse.categories.furniture", "Furniture")}
              </option>
              <option value="Books">
                {t("browse.categories.books", "Books")}
              </option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Grid */}
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-500">
            {t("browse.noItems", "No items found.")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
              >
                {/* Image */}
                <div className="h-56 w-full bg-gray-100 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {item.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {item.category}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        item.condition === "Like New"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.condition}
                    </span>
                  </div>

                  {/* Request Button */}
                  <div className="mt-auto">
                    <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
                      {t("browse.requestItem", "Request Item")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
