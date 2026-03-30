import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logging in with phone:", phone);
    // TODO: Connect your OTP authentication logic here
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-12">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="w-full">
          {/* Phone Number Field */}
          <div className="flex flex-col space-y-1.5 mb-4">
            <label className="text-xs text-gray-500 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
              placeholder="+855 123 456 789"
              className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
              required
            />
          </div>

          {/* OTP / Login Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-md shadow-sm transition-colors"
          >
            Send OTP
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
