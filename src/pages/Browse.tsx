"use client";

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import DonationGrid from '../components/DonationGrid';
import { Loader2, X, ChevronLeft, ChevronRight, Info, Package } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Browse: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All"); 
  const [donations, setDonations] = useState<any[]>([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Modals States
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategoryId]);

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.content || []);
      } catch (err) { console.error("Category Load Error:", err); }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Donations
  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        let url = `${BASE_URL}/api/v1/donations`;
        if (selectedCategoryId !== "All") url += `?categoryId=${selectedCategoryId}`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.content || [];

        const mappedItems = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || "No description provided.", // Added for Read More
          quantity: item.quantity || 1, // Added for Read More
          location: item.address || "Phnom Penh",
          timeAgo: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
          category: item.category?.name || "General",
          imageUrl: item.imageUrls?.[0] || "https://via.placeholder.com/400x300",
          condition: item.condition === "POOR" ? "Old" : 
                     item.condition === "FAIR" ? "New" : 
                     item.condition === "LIKE_NEW" ? "Like New" : "Good"
        }));
        setDonations(mappedItems);
      } catch (err: any) { setError(err.message); }
      finally { setIsLoading(false); }
    };
    fetchDonations();
  }, [selectedCategoryId]);

  // 3. Request Logic
  const handleSendRequest = async () => {
    if (!selectedItem || !requestMessage.trim()) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${BASE_URL}/api/v1/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ donationId: selectedItem.id, message: requestMessage }),
      });
      if (!response.ok) throw new Error("Failed to send request");
      alert("Request sent successfully!");
      setIsRequestModalOpen(false);
      setRequestMessage('');
    } catch (err: any) { alert(err.message); }
    finally { setIsSubmitting(false); }
  };

  // Pagination Logic
  const filteredDonations = donations.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const currentItems = filteredDonations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">Browse Donations</h1>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter categories={categories} selected={selectedCategoryId} onSelect={setSelectedCategoryId} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600" size={40} /></div>
      ) : (
        <>
          <DonationGrid 
            items={currentItems} 
            onItemClick={(id) => {
              const item = donations.find(d => d.id === id);
              setSelectedItem(item);
              setIsDetailModalOpen(true); // Open Details when clicking "Read More"
            }}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 border rounded-full disabled:opacity-30"><ChevronLeft /></button>
              <span className="font-bold">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border rounded-full disabled:opacity-30"><ChevronRight /></button>
            </div>
          )}
        </>
      )}

      {/* --- DETAIL MODAL (Read More) --- */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-64">
              <img src={selectedItem.imageUrl} className="w-full h-full object-cover" alt="" />
              <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-black text-gray-900 uppercase leading-none">{selectedItem.title}</h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Package size={14}/> Qty: {selectedItem.quantity}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{selectedItem.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <span className="block text-gray-400 uppercase text-[10px] font-black">Condition</span>
                  <span className="font-bold text-gray-800">{selectedItem.condition}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <span className="block text-gray-400 uppercase text-[10px] font-black">Category</span>
                  <span className="font-bold text-gray-800">{selectedItem.category}</span>
                </div>
              </div>
              <button 
                onClick={() => { setIsDetailModalOpen(false); setIsRequestModalOpen(true); }}
                className="w-full py-4 bg-[#C84C0E] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#A33D0B] transition-all"
              >
                Send Request Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REQUEST MODAL --- */}
      {isRequestModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase">Request Item</h2>
              <button onClick={() => setIsRequestModalOpen(false)}><X size={24} className="text-gray-400" /></button>
            </div>
            <textarea
              className="w-full h-32 p-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none mb-4"
              placeholder="Why do you need this item?"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setIsRequestModalOpen(false)} className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-bold uppercase text-xs">Cancel</button>
              <button 
                onClick={handleSendRequest}
                disabled={isSubmitting || !requestMessage.trim()}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold uppercase text-xs disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;