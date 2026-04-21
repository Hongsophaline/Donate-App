import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie"; // <-- import js-cookie

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://material-donation-backend-8.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // ✅ Store token in cookies instead of localStorage
      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 7, // 7 days expiration
          secure: true, // send only over HTTPS
          sameSite: "Strict", // CSRF protection
        });
      }

      // Redirect to home
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-12">
          {t("login.title")}
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              {t("login.phoneLabel")}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+855 123 456 789"
              className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              {t("signup.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 py-3 ${
              isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold text-sm rounded-md shadow-sm transition-colors`}
          >
            {isLoading ? "Checking..." : t("login.button") || "Login"}
          </button>
        </form>

        <div className="mt-4 text-xs text-gray-600">
          {t("login.noAccount")}{" "}
          <Link
            to="/signup"
            className="text-blue-500 underline hover:text-blue-600"
          >
            {t("login.signupLink")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
