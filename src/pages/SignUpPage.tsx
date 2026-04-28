"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Accessing the environment variable with a fallback to localhost
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
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

    // 1. Validation Logic
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

    // 2. Prepare Payloads
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

    console.log("--- Request Started ---");
    console.log(`Target URL: ${BASE_URL}/api/v1/auth/register`);
    console.log("Payload being sent:", payload);

    // 3. Fetch API
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Registration Failed (Server Response):", data);
        throw new Error(
          data.message || "Registration failed. Check console for details.",
        );
      }

      console.log("--- Registration Success! ---");
      console.log("Response Data:", data);

      alert("Account created successfully!");
      navigate("/login");
    } catch (err: any) {
      console.error("Catch Block Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          {t("signup.title")}
        </h1>
        <p className="text-[10px] text-gray-300 font-mono mb-8 uppercase tracking-widest">
          Env: {BASE_URL.includes('localhost') ? 'Localhost' : 'Remote'}
        </p>

        {/* User Type Switcher */}
        <div className="flex w-full mb-8 bg-gray-100 rounded-md p-1">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setUserType("individual")}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
              userType === "individual"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            {t("signup.individual")}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setUserType("organization")}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
              userType === "organization"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            {t("signup.organization")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Full Name */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              {t("signup.fullName")}
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              {t("signup.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+855 12 345 678"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
              required
            />
          </div>

          {/* Conditional Field: Date of Birth (Individual) */}
          {userType === "individual" && (
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs text-gray-500 font-medium">
                {t("signup.dob")}
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ""}
                onChange={handleInputChange}
                className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
                required
              />
            </div>
          )}

          {/* Conditional Field: Org Email (Organization) */}
          {userType === "organization" && (
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs text-gray-500 font-medium">
                {t("signup.orgEmail")}
              </label>
              <input
                type="email"
                name="organizationEmail"
                placeholder="organization@example.com"
                value={formData.organizationEmail || ""}
                onChange={handleInputChange}
                className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
                required
              />
            </div>
          )}

          {/* Password */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              {t("signup.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md pr-12 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 py-3 ${isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} text-white font-semibold text-sm rounded-md shadow-sm transition-colors`}
          >
            {isLoading ? "Signing up..." : t("signup.button")}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-600">
          {t("signup.alreadyHaveAccount")}{" "}
          <Link
            to="/login"
            className="text-blue-500 underline hover:text-blue-600"
          >
            {t("signup.loginLink")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;