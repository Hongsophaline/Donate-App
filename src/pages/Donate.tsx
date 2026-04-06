"use client";

import React, { useState } from "react";
import { Camera, MapPin, Upload, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormData {
  title: string;
  category: string;
  description: string;
  location: string;
}

export default function DonatePage() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
    location: "",
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted!", { ...formData, images: selectedImages });
    // TODO: call your API to submit the donation
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          {t("donate.title", "Donate Your Items")}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {t(
            "donate.subtitle",
            "Fill in the details below to list your items for donation.",
          )}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md md:max-w-2xl bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-6 shadow-sm"
      >
        {/* Item Title */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("donate.fields.title", "Item Title")}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder={t(
              "donate.placeholders.title",
              "e.g., Winter jacket, like new",
            )}
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("donate.fields.category", "Category Item")}
          </label>
          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="" disabled>
                {t("donate.placeholders.category", "Select a Category")}
              </option>
              <option value="clothing">
                {t("donate.categories.clothing", "Clothing")}
              </option>
              <option value="furniture">
                {t("donate.categories.furniture", "Furniture")}
              </option>
              <option value="electronics">
                {t("donate.categories.electronics", "Electronics")}
              </option>
              <option value="books">
                {t("donate.categories.books", "Books")}
              </option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("donate.fields.description", "Description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={t(
              "donate.placeholders.description",
              "Describe the condition, size and any other detail",
            )}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none md:resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        {/* Photos */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("donate.fields.photos", "Photos")}
          </label>
          <label
            htmlFor="photos"
            className="flex flex-col items-center justify-center w-full sm:h-40 h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Camera className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {t("donate.placeholders.upload", "Click to upload photos")}
              </p>
              <p className="text-xs text-gray-400">
                {t("donate.placeholders.uploadInfo", "PNG, JPG up to 5MB")}
              </p>
            </div>
            <input
              id="photos"
              type="file"
              multiple
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {selectedImages.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {t("donate.selectedImages", "Selected")}: {selectedImages.length}{" "}
              {t("donate.images", "images")}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col space-y-1.5 relative">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-gray-400" />
          </span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder={t(
              "donate.placeholders.location",
              "Enter your address or area",
            )}
            className="w-full pl-9 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition-colors"
        >
          <Upload className="mr-2 h-4 w-4" />
          {t("donate.submit", "Submit Donation")}
        </button>
      </form>
    </div>
  );
}
