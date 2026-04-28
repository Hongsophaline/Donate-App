"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Loader2, CheckCircle2, AlertCircle, Camera, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dml6kygxk/image/upload";
const UPLOAD_PRESET = "Mary_default";

async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Cloudinary Upload Failed");
  return data.secure_url;
}

export default function Donate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    condition: "",
    address: "",
    quantity: 1,
    latitude: 11.5564,   // Phnom Penh default
    longitude: 104.9282,
  });

  const getAuthHeader = (): HeadersInit => {
    const token = Cookies.get("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch categories (public)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        if (!res.ok) {
          console.error(`Failed to fetch categories: ${res.status}`);
          return;
        }
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error("Category Load Error:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return setStatus({ type: "error", text: "Please select a category" });
    if (!imageFile) return setStatus({ type: "error", text: "Please upload an image" });

    setIsSubmitting(true);
    setStatus(null);

    try {
      // 1. Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageFile);

      // 2. Create donation
      const res = await fetch(`${API_BASE_URL}/api/v1/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
          condition: formData.condition,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error("Donation creation failed:", res.status, errorText);
        if (res.status === 403) {
          throw new Error("Access denied. Please log in again.");
        }
        throw new Error(`Failed to create donation: ${res.status}`);
      }

      const donation = await res.json();

      // 3. Link image
      if (imageUrl && donation.id) {
        await fetch(
          `${API_BASE_URL}/api/v1/donations/${donation.id}/images?imageUrl=${encodeURIComponent(imageUrl)}`,
          {
            method: "POST",
            headers: getAuthHeader(),
          }
        );
      }

      setStatus({ type: "success", text: "Donation successful! Redirecting..." });
      setTimeout(() => navigate("/browse"), 2000);
    } catch (err: any) {
      console.error("Submit error:", err);
      setStatus({ type: "error", text: err.message || "Failed to submit donation" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">List an Item</h1>
          <span className="text-xs text-gray-400">API: {API_BASE_URL}</span>
        </div>

        {status && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{status.text}</span>
          </div>
        )}

        {/* Image Upload */}
        <div className="space-y-2">
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <Camera className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-semibold">Click to upload photo</p>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { 
                    setImageFile(file); 
                    setPreview(URL.createObjectURL(file)); 
                  }
                }} 
              />
            </label>
          ) : (
            <div className="relative h-48 w-full">
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg border" />
              <button 
                type="button" 
                onClick={() => {setPreview(""); setImageFile(null);}} 
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16}/>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="Title" 
            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
            required 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
          <select 
            className="p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500" 
            required 
            value={formData.categoryId} 
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          >
            <option value="">Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            className="p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500" 
            required 
            value={formData.condition} 
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          >
            <option value="">Condition</option>
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </select>
          <input 
            type="number" 
            min={1} 
            placeholder="Quantity" 
            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
            required 
            value={formData.quantity} 
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} 
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input 
            placeholder="Pickup Address" 
            className="w-full p-3 pl-10 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
            required 
            value={formData.address} 
            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
          />
        </div>

        <textarea 
          placeholder="Description" 
          className="p-3 border rounded-lg w-full h-32 outline-none focus:ring-2 focus:ring-green-500" 
          required 
          value={formData.description} 
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
        />

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-all flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <><Loader2 className="animate-spin" size={20} /> Processing...</>
          ) : (
            "Submit Donation"
          )}
        </button>
      </form>
    </div>
  );
}