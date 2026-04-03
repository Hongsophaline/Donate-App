"use client";

import React, { useState } from "react";
import { Camera, MapPin, Upload, ChevronDown, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormData {
  title: string;
  categoryId: string;
  description: string;
  location: string;
  condition: string;
  quantity: number;
}

export default function DonatePage() {
  const { t } = useTranslation();
  
  // State Management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    categoryId: "",
    description: "",
    location: "",
    condition: "NEW",
    quantity: 1,
  });

  // Handle Text/Select Inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    }));
    if (error) setError(null);
  };

  // Handle Image Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  // Main Fetch Function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Get Token (Required for 403 Forbidden fix)
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

    // 2. Prepare Payload
    const payload = {
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      condition: formData.condition,
      location: formData.location,
      quantity: formData.quantity,
    };

    console.log("--- Outgoing Request ---");
    console.log("Payload:", payload);

    try {
      const response = await fetch("https://material-donation-backend-3.onrender.com/api/v1/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      // 3. Safe JSON Parsing (Prevents "Unexpected end of JSON" error)
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        console.error("Server Error Response:", data);
        if (response.status === 403) {
          throw new Error("Authorization failed (403). Please log in again.");
        }
        throw new Error(data.message || `Error ${response.status}: Failed to submit`);
      }

      // --- SUCCESS: DATA LOGGED TO CONSOLE ---
      console.log("--- DONATION SUCCESS! ---");
      console.log("Response Data:", data);
      // ---------------------------------------

      alert("Donation submitted successfully!");
      
      // Reset form after success
      setFormData({
        title: "",
        categoryId: "",
        description: "",
        location: "",
        condition: "NEW",
        quantity: 1,
      });
      setSelectedImages([]);

    } catch (err: any) {
      console.error("Catch Block Error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          {t("donate.title", "Donate Your Items")}
        </h1>
        <p className="text-gray-600">
          {t("donate.subtitle", "Provide details about your donation item.")}
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-6 shadow-sm"
      >
        {/* Title */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-gray-700">{t("donate.fields.title", "Item Title")}</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Winter Jacket - Size M"
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Select */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t("donate.fields.category", "Category")}</label>
            <div className="relative">
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white appearance-none pr-10"
                required
              >
                <option value="">Select Category</option>
                <option value="5a1af0ba-8ace-4198-931e-b29387e9ff5d">Clothing</option>
                <option value="d2b1c9e7-5f8a-4c3e-9a1b-6f4e2a7c8d9f">Electronics</option>
                <option value="3c4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8g">Furniture</option>
                <option value="9f8e7d6c-5b4a-3e2f-1a0b-9c8d7e6f5a4b">Books</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Condition Select */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Condition</label>
            <div className="relative">
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white appearance-none pr-10"
                required
              >
                <option value="NEW">New</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-gray-700">{t("donate.fields.description", "Description")}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe the item condition, size, etc."
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
            required
          />
        </div>

        {/* Location Input */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Location</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter City or Street"
              className="w-full pl-10 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-md font-semibold text-white transition-all shadow-sm ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-95"
          }`}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Processing..." : t("donate.submit", "Submit Donation")}
        </button>
      </form>
    </div>
  );
}