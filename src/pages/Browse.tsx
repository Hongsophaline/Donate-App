"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import DonationGrid from "../components/DonationGrid";
import { Loader2, X, ChevronLeft, ChevronRight, Package } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Browse: React.FC = () => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
  const [donations, setDonations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryId]);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // FETCH DONATIONS
  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        let url = `${BASE_URL}/api/v1/donations`;
        if (selectedCategoryId !== "All")
          url += `?categoryId=${selectedCategoryId}`;

        const res = await fetch(url);
        const data = await res.json();

        const items = Array.isArray(data) ? data : data.content || [];

        const mapped = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || "No description provided",
          quantity: item.quantity || 1,
          location: item.address || "Phnom Penh",
          timeAgo: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "Recently",
          category: item.category?.name || "General",
          imageUrl:
            item.imageUrls?.[0] || "https://via.placeholder.com/400x300",
          condition:
            item.condition === "POOR"
              ? "Old"
              : item.condition === "FAIR"
                ? "New"
                : item.condition === "LIKE_NEW"
                  ? "Like New"
                  : "Good",
        }));

        setDonations(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [selectedCategoryId]);

  const filteredDonations = donations.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  const currentItems = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER (TRANSLATION FIXED) */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">
          {t("browse.title")}
        </h1>
        <p className="text-gray-500">{t("browse.subtitle")}</p>
      </header>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter
          categories={categories}
          selected={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-green-600" size={40} />
        </div>
      ) : (
        <>
          {/* GRID */}
          <DonationGrid
            items={currentItems}
            onItemClick={(id) => {
              const item = donations.find((d) => d.id === id);
              setSelectedItem(item);
              setIsDetailModalOpen(true);
            }}
          />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-full disabled:opacity-30"
              >
                <ChevronLeft />
              </button>

              <span className="font-bold">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 border rounded-full disabled:opacity-30"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <img
              src={selectedItem.imageUrl}
              className="w-full h-60 object-cover rounded-xl mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>

            <p className="text-gray-600 mb-4">{selectedItem.description}</p>

            <button
              onClick={() => {
                setIsDetailModalOpen(false);
                setIsRequestModalOpen(true);
              }}
              className="w-full bg-[#C84C0E] text-white py-3 rounded-xl font-bold"
            >
              {t("donate.submit")}
            </button>
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {t("notifications.newRequest")}
            </h2>

            <textarea
              className="w-full border p-3 rounded-lg mb-4"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />

            <button
              className="w-full bg-green-600 text-white py-2 rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "..." : t("notifications.approve")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
