"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Cloudinary Configuration from your successful test
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dml6kygxk/image/upload";
const UPLOAD_PRESET = "Mary_default";

async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error?.message || "Cloudinary Upload Failed");
  return data.secure_url;
}

export default function Donate() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    condition: "",
    address: "",
    quantity: 1,
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetch("https://material-donation-backend-8.onrender.com/api/categories", {
      headers: getAuthHeader() as any,
    })
      .then((res) => res.json())
      .then((data) =>
        setCategories(Array.isArray(data) ? data : data.content || []),
      )
      .catch((err) => console.error("Category Load Error:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId)
      return setStatus({
        type: "error",
        text: t("donate.status.errorCategory"),
      });

    if (!imageFile)
      return setStatus({
        type: "error",
        text: t("donate.status.errorImage"),
      });

    setIsSubmitting(true);
    setStatus(null);

    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);

      const res = await fetch(
        "https://material-donation-backend-8.onrender.com/api/v1/donations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(getAuthHeader() as any),
          },
          body: JSON.stringify({
            ...formData,
            quantity: Number(formData.quantity),
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to create donation");
      const donation = await res.json();

      if (imageUrl && donation.id) {
        await fetch(
          `https://material-donation-backend-8.onrender.com/api/v1/donations/${donation.id}/images?imageUrl=${encodeURIComponent(
            imageUrl,
          )}`,
          {
            method: "POST",
            headers: getAuthHeader() as any,
          },
        );
      }

      setStatus({
        type: "success",
        text: t("donate.status.success"),
      });

      setTimeout(() => navigate("/browse"), 2000);
    } catch (err: any) {
      setStatus({ type: "error", text: err.message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 text-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6"
      >
        {/* TITLE */}
        <h1 className="text-2xl font-bold">{t("donate.title")}</h1>

        {/* STATUS */}
        {status && (
          <div
            className={`p-4 rounded-lg flex items-center gap-2 ${
              status.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm font-medium">{status.text}</span>
          </div>
        )}

        {/* IMAGE UPLOAD */}
        <div className="space-y-2">
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <Camera className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-semibold">
                {t("donate.uploadPhoto")}
              </p>

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
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview("");
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder={t("donate.placeholders.title")}
            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <select
            className="p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500"
            required
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
          >
            <option value="">{t("donate.placeholders.category")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* CONDITION + QUANTITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500"
            required
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
          >
            <option value="">{t("donate.fields.condition")}</option>
            <option value="NEW">{t("donate.conditions.new")}</option>
            <option value="GOOD">{t("donate.conditions.good")}</option>
            <option value="LIKE_NEW">{t("donate.conditions.likeNew")}</option>
            <option value="OLD">{t("donate.conditions.old")}</option>
          </select>

          <input
            type="number"
            min={1}
            placeholder={t("donate.fields.quantity")}
            className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            required
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: Number(e.target.value),
              })
            }
          />
        </div>

        {/* ADDRESS */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            placeholder={t("donate.placeholders.address")}
            className="w-full p-3 pl-10 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        {/* DESCRIPTION */}
        <textarea
          placeholder={t("donate.placeholders.description")}
          className="p-3 border rounded-lg w-full h-32 outline-none focus:ring-2 focus:ring-green-500"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-all flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              {t("donate.status.processing")}
            </>
          ) : (
            t("donate.submit")
          )}
        </button>
      </form>
    </div>
  );
}
