// "use client";

// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie'; // Import Cookies
// import SearchBar from '../components/SearchBar';
// import CategoryFilter from '../components/CategoryFilter';
// import DonationGrid from '../components/DonationGrid';
// import { Loader2, X, ChevronLeft, ChevronRight, Package } from "lucide-react";

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// const Browse: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All"); 
//   const [donations, setDonations] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 9;

//   const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<any | null>(null);
//   const [requestMessage, setRequestMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategoryId]);

//   // Fetch Categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/categories`);
//         if (!res.ok) throw new Error("Failed to fetch categories");
//         const data = await res.json();
//         setCategories(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Category Load Error:", err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch Donations
//   useEffect(() => {
//     const fetchDonations = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         let url = `${BASE_URL}/api/v1/donations`;
//         if (selectedCategoryId !== "All") {
//           url += `?categoryId=${selectedCategoryId}`;
//         }
//         const res = await fetch(url);
//         if (!res.ok) throw new Error(`Server error: ${res.status}`);
//         const data = await res.json();
//         const items = Array.isArray(data) ? data : data.content || [];

//         const mappedItems = items.map((item: any) => ({
//           id: item.id,
//           title: item.title,
//           description: item.description || "No description provided.",
//           quantity: item.quantity || 1,
//           location: item.address || "Phnom Penh",
//           timeAgo: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
//           category: item.category?.name || "General",
//           imageUrl: item.imageUrls?.[0] || "https://via.placeholder.com/400x300",
//           condition: item.condition === "POOR" ? "Old" : 
//                      item.condition === "FAIR" ? "Fair" : 
//                      item.condition === "LIKE_NEW" ? "Like New" : "Good"
//         }));
//         setDonations(mappedItems);
//       } catch (err: any) {
//         setError(err.message || "Failed to load donations");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchDonations();
//   }, [selectedCategoryId]);

//   // SEND REQUEST FUNCTION
//   const handleSendRequest = async () => {
//     if (!selectedItem || !requestMessage.trim()) return;
//     setIsSubmitting(true);

//     try {
//       const token = Cookies.get("token");
//       if (!token) {
//         alert("Please log in to send a request.");
//         return;
//       }

//       // Prepare the payload exactly matching the CreateRequest DTO
//       const payload = { 
//         // Ensure this is the raw UUID string from your database
//         donationId: selectedItem.id, 
//         message: requestMessage 
//       };

//       console.log("Sending Payload to Backend:", payload);

//       const response = await fetch(`${BASE_URL}/api/v1/requests`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json', 
//           'Authorization': `Bearer ${token}` 
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         // Try to get detailed validation errors from Spring
//         const errorData = await response.json().catch(() => ({}));
//         console.error("400 Error Details:", errorData);
        
//         // If validation failed, errorData often contains a "message" or "errors" array
//         throw new Error(errorData.message || `Server Error: ${response.status}`);
//       }

//       alert("Request sent successfully!");
//       setIsRequestModalOpen(false);
//       setRequestMessage('');

//     } catch (err: any) {
//       console.error("Request error:", err);
//       alert(err.message || "Failed to send request.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Filter and Pagination
//   const filteredDonations = donations.filter(item => 
//     item.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
//   const currentItems = filteredDonations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-12">
//       <header className="text-center mb-12">
//         <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">Browse Donations</h1>
//         <p className="text-gray-500">Find items you need or share with others.</p>
//       </header>

//       <div className="flex flex-col md:flex-row gap-4 mb-10">
//         <SearchBar value={searchQuery} onChange={setSearchQuery} />
//         <CategoryFilter categories={categories} selected={selectedCategoryId} onSelect={setSelectedCategoryId} />
//       </div>

//       {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center font-bold">{error}</div>}

//       {isLoading ? (
//         <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600" size={40} /></div>
//       ) : (
//         <>
//           <DonationGrid items={currentItems} onItemClick={(id) => {
//               const item = donations.find(d => d.id === id);
//               setSelectedItem(item);
//               setIsDetailModalOpen(true);
//           }}/>
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-4 mt-12">
//               <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 border rounded-full hover:bg-gray-50"><ChevronLeft /></button>
//               <span className="font-bold text-sm">Page {currentPage} of {totalPages}</span>
//               <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border rounded-full hover:bg-gray-50"><ChevronRight /></button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Detail Modal */}
//       {isDetailModalOpen && selectedItem && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
//             <div className="relative h-64">
//               <img src={selectedItem.imageUrl} className="w-full h-full object-cover" alt={selectedItem.title} />
//               <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/40"><X size={20} /></button>
//             </div>
//             <div className="p-8">
//               <h2 className="text-3xl font-black text-gray-900 uppercase mb-4">{selectedItem.title}</h2>
//               <p className="text-gray-600 mb-6">{selectedItem.description}</p>
//               <button onClick={() => { setIsDetailModalOpen(false); setIsRequestModalOpen(true); }} className="w-full py-4 bg-[#C84C0E] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#A33D0B]">Send Request Now</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Request Modal */}
//       {isRequestModalOpen && selectedItem && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//             <h2 className="text-2xl font-black text-gray-900 uppercase mb-4">Request Item</h2>
//             <textarea className="w-full h-32 p-4 border-2 border-gray-100 rounded-xl mb-4 outline-none" placeholder="Message to donor..." value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} />
//             <div className="flex gap-3">
//               <button onClick={() => setIsRequestModalOpen(false)} className="flex-1 py-3 border-2 rounded-xl font-bold uppercase text-xs">Cancel</button>
//               <button onClick={handleSendRequest} disabled={isSubmitting || !requestMessage.trim()} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold uppercase text-xs">
//                 {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Submit Request"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Browse;
"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import DonationGrid from '../components/DonationGrid';
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Browse: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All"); 
  const [donations, setDonations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset to page 1 when filters change
  useEffect(() => { 
    setCurrentPage(1); 
  }, [searchQuery, selectedCategoryId]);

  // 1. Fetch Categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Category Load Error:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Donations (Filtered by selectedCategoryId)
  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Construct URL with categoryId query parameter
        let url = `${BASE_URL}/api/v1/donations`;
        const params = new URLSearchParams();
        
        if (selectedCategoryId !== "All") {
          params.append("categoryId", selectedCategoryId);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.content || [];

        // Map API response to UI format
        const mappedItems = items.map((item: any) => {
          // Look up category name from our categories state
          const categoryObj = categories.find(c => c.id === item.categoryId);
          
          return {
            id: item.id,
            title: item.title,
            description: item.description || "No description provided.",
            quantity: item.quantity || 1,
            location: item.address || "Phnom Penh",
            timeAgo: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
            category: categoryObj ? categoryObj.name : "General",
            imageUrl: item.imageUrls?.[0] || "https://via.placeholder.com/400x300",
            condition: item.condition === "POOR" ? "Old" : 
                       item.condition === "FAIR" ? "Fair" : 
                       item.condition === "LIKE_NEW" ? "Like New" : "Good"
          };
        });
        
        setDonations(mappedItems);
      } catch (err: any) {
        setError(err.message || "Failed to load donations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [selectedCategoryId, categories]); // Re-run when category selection or category list changes

  // 3. Handle Donation Request
  const handleSendRequest = async () => {
    if (!selectedItem || !requestMessage.trim()) return;
    setIsSubmitting(true);

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please log in to send a request.");
        return;
      }

      const payload = { 
        donationId: selectedItem.id, 
        message: requestMessage 
      };

      const response = await fetch(`${BASE_URL}/api/v1/requests`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server Error: ${response.status}`);
      }

      alert("Request sent successfully!");
      setIsRequestModalOpen(false);
      setRequestMessage('');

    } catch (err: any) {
      alert(err.message || "Failed to send request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Client-side Search filtering and Pagination
  const filteredDonations = donations.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const currentItems = filteredDonations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">Browse Donations</h1>
        <p className="text-gray-500">Find items you need or share with others.</p>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter 
          categories={categories} 
          selected={selectedCategoryId} 
          onSelect={setSelectedCategoryId} 
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center font-bold">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-green-600" size={40} />
        </div>
      ) : (
        <>
          <DonationGrid 
            items={currentItems} 
            onItemClick={(id) => {
              const item = donations.find(d => d.id === id);
              setSelectedItem(item);
              setIsDetailModalOpen(true);
            }}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                disabled={currentPage === 1} 
                className="p-2 border rounded-full hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronLeft />
              </button>
              <span className="font-bold text-sm">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                disabled={currentPage === totalPages} 
                className="p-2 border rounded-full hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="relative h-64">
              <img src={selectedItem.imageUrl} className="w-full h-full object-cover" alt={selectedItem.title} />
              <button 
                onClick={() => setIsDetailModalOpen(false)} 
                className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/40"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{selectedItem.category}</span>
                <span className="text-xs text-gray-400">{selectedItem.location}</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 uppercase mb-4">{selectedItem.title}</h2>
              <p className="text-gray-600 mb-6">{selectedItem.description}</p>
              <button 
                onClick={() => { setIsDetailModalOpen(false); setIsRequestModalOpen(true); }} 
                className="w-full py-4 bg-[#C84C0E] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#A33D0B] transition-colors"
              >
                Send Request Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {isRequestModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-black text-gray-900 uppercase mb-4">Request Item</h2>
            <p className="text-sm text-gray-500 mb-4">Requesting: <strong>{selectedItem.title}</strong></p>
            <textarea 
              className="w-full h-32 p-4 border-2 border-gray-100 rounded-xl mb-4 outline-none focus:border-green-500 transition-all" 
              placeholder="Tell the donor why you need this item..." 
              value={requestMessage} 
              onChange={(e) => setRequestMessage(e.target.value)} 
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setIsRequestModalOpen(false)} 
                className="flex-1 py-3 border-2 rounded-xl font-bold uppercase text-xs hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendRequest} 
                disabled={isSubmitting || !requestMessage.trim()} 
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold uppercase text-xs disabled:bg-gray-300 transition-colors"
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