import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("hong.sophaline@institute.com");
  const [password, setPassword] = useState<string>("supersecretpassword");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    // TODO: Connect your authentication logic here
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-12">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Email Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-md shadow-sm transition-colors"
          >
            Login
          </button>
        </form>

        {/* Account help links */}
        <div className="mt-4 text-xs text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 underline hover:text-blue-600"
          >
            Sign up
          </Link>
        </div>

        {/* CTA Button to Register */}
        <div className="mt-16">
          <Link
            to="/signup"
            className="inline-block px-10 py-3 bg-orange-700 hover:bg-orange-800 text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
