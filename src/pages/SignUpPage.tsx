import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

interface SignUpForm {
  fullName: string;
  email: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<SignUpForm>({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Signing up with:", formData);
    // TODO: Add your API registration call here
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-12">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Full Name Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
              required
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
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

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-md shadow-sm transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to Login */}
        <div className="mt-6 text-xs text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 underline hover:text-blue-600"
          >
            Log in
          </Link>
        </div>

        {/* Social Register Section */}
        <div className="mt-12 w-full flex flex-col items-center">
          <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
