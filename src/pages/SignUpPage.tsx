"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface SignUpForm {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  organizationEmail?: string;
  dateOfBirth?: string;
}

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [userType, setUserType] = useState<"individual" | "organization">(
    "individual",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<SignUpForm>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    organizationEmail: "",
    dateOfBirth: "",
  });

  // ✅ Phone validation
  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s-]/g, "");
    const cambodiaRegex = /^(\+855|0)[1-9]\d{7,8}$/;
    return cambodiaRegex.test(cleaned);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handlePhoneBlur = () => {
    if (formData.phone && !isValidPhone(formData.phone)) {
      setError("Invalid phone number format. Use +855 or 0 format.");
    }
  };

  const isAdult = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // ✅ Phone validation BEFORE API call
    if (!isValidPhone(formData.phone)) {
      setError("Invalid phone number format. Use +855 or 0 format.");
      setIsLoading(false);
      return;
    }

    if (userType === "individual") {
      if (!formData.dateOfBirth) {
        setError(t("signup.errors.dobRequired"));
        setIsLoading(false);
        return;
      }
      if (!isAdult(formData.dateOfBirth)) {
        setError(t("signup.errors.underage"));
        setIsLoading(false);
        return;
      }
    }

    if (userType === "organization" && !formData.organizationEmail) {
      setError(t("signup.errors.orgEmailRequired"));
      setIsLoading(false);
      return;
    }

    const payload =
      userType === "individual"
        ? {
            fullName: formData.fullName,
            phone: formData.phone,
            password: formData.password,
            userType: "INDIVIDUAL",
            dob: formData.dateOfBirth,
            avatarUrl:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=individual",
          }
        : {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.organizationEmail,
            password: formData.password,
            userType: "Organization",
            avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=org",
          };

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Account created successfully!");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-8">{t("signup.title")}</h1>

        {/* User Type */}
        <div className="flex w-full mb-8 bg-gray-100 rounded-md p-1">
          <button
            type="button"
            onClick={() => setUserType("individual")}
            className={`w-1/2 py-2 ${
              userType === "individual" ? "bg-white shadow" : ""
            }`}
          >
            {t("signup.individual")}
          </button>

          <button
            type="button"
            onClick={() => setUserType("organization")}
            className={`w-1/2 py-2 ${
              userType === "organization" ? "bg-white shadow" : ""
            }`}
          >
            {t("signup.organization")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Full Name */}
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-100 rounded-md"
            required
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="+855 12 345 678"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handlePhoneBlur}
            className="w-full p-3 bg-gray-100 rounded-md"
            required
          />

          {/* DOB */}
          {userType === "individual" && (
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ""}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-100 rounded-md"
              required
            />
          )}

          {/* Org Email */}
          {userType === "organization" && (
            <input
              type="email"
              name="organizationEmail"
              placeholder="org@email.com"
              value={formData.organizationEmail || ""}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-100 rounded-md"
              required
            />
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-100 rounded-md pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-md"
          >
            {isLoading ? "Signing up..." : t("signup.button")}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link to="/login" className="text-blue-500">
            {t("signup.loginLink")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
