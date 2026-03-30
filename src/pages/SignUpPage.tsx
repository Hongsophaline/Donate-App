import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

interface SignUpForm {
  fullName: string;
  email: string;
  password: string;
  phone: number | string;
  organizationEmail?: string;
  dateOfBirth?: string;
}

const SignUpPage: React.FC = () => {
  const [userType, setUserType] = useState<"individual" | "organization">(
    "individual",
  );

  const [formData, setFormData] = useState<SignUpForm>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    organizationEmail: "",
    dateOfBirth: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // clear error when typing
  };

  // Check age ≥ 18
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

  // Handle submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate Individual
    if (userType === "individual") {
      if (!formData.dateOfBirth) {
        setError("Please select your date of birth.");
        return;
      }

      if (!isAdult(formData.dateOfBirth)) {
        setError("You must be at least 18 years old to register.");
        return;
      }
    }

    // Validate Organization
    if (userType === "organization" && !formData.organizationEmail) {
      setError("Organization email is required.");
      return;
    }

    const payload = {
      ...formData,
      type: userType,
    };

    console.log("Register Data:", payload);

    // TODO: API call here
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">
          Create an account
        </h1>

        {/* User Type Selector */}
        <div className="flex w-full mb-8 bg-gray-100 rounded-md p-1">
          <button
            type="button"
            onClick={() => setUserType("individual")}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
              userType === "individual"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            Individual
          </button>

          <button
            type="button"
            onClick={() => setUserType("organization")}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
              userType === "organization"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            Organization
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Full Name */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Sophaline Hong"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-3.5 bg-gray-100 text-gray-800 text-sm rounded-md focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs text-gray-500 font-medium">
              Phone Number
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

          {/* DOB for Individual */}
          {userType === "individual" && (
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs text-gray-500 font-medium">
                Date of Birth
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

          {/* Organization Email */}
          {userType === "organization" && (
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs text-gray-500 font-medium">
                Organization Email
              </label>
              <input
                type="email"
                name="organizationEmail"
                placeholder="org@example.com"
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

          {/* Error Message */}
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-md shadow-sm transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* Login Redirect */}
        <div className="mt-6 text-xs text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 underline hover:text-blue-600"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
