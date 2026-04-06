"use client";

import React, { useState, useEffect } from "react";
import { Camera, MapPin, Upload, ChevronDown, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Donate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    description: "",
    location: "",
    condition: "LIKE_NEW",
    quantity: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{type: 'success'|'error', text: string}|null>(null);

  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetch("https://material-donation-backend-3.onrender.com/api/categories", { 
      headers: getAuthHeader() 
    })
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : (data.content || [])))
      .catch(err => console.error("Category Load Error:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      setStatus({ type: 'error', text: "Please select a category" });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      // Fix for the 500 error: Ensure quantity is a Number
      const payload = {
        ...formData,
        quantity: Number(formData.quantity)
      };

      const res = await fetch("https://material-donation-backend-3.onrender.com/api/v1/donations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          ...getAuthHeader() 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create donation.");
      }

      setStatus({ type: 'success', text: "Donation created! Redirecting..." });
      setTimeout(() => navigate("/browse"), 2000);
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 text-black font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white border rounded-xl p-8 space-y-6 shadow-sm">
        <h1 className="text-2xl font-bold">List an Item</h1>
        
        {status && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {status.text}
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-sm font-semibold">Title</label>
          <input 
            placeholder="e.g., Wooden Dining Table" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            required 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">Category</label>
              <select 
                className="w-full p-3 border rounded-lg bg-white" 
                required 
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">Quantity</label>
              <input 
                type="number" 
                min="1"
                className="w-full p-3 border rounded-lg" 
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>

          <label className="block text-sm font-semibold">Description</label>
          <textarea 
            placeholder="Describe the item..." 
            className="w-full p-3 border rounded-lg" 
            rows={3} 
            required 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
          
          <label className="block text-sm font-semibold">Pickup Address</label>
          <input 
            placeholder="Location" 
            className="w-full p-3 border rounded-lg" 
            required 
            onChange={e => setFormData({...formData, location: e.target.value})} 
          />
        </div>

        <button 
          disabled={isSubmitting} 
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-all"
        >
          {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Submit Donation"}
        </button>
      </form>
    </div>
  );
}