import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import hero from "../assets/hero-home.webp";
import {
  ClipboardList,
  Search,
  CalendarClock,
  LineChart,
  Bell,
  Star,
  Shirt,
  Book,
  Sofa,
  Laptop,
  Baby,
  Boxes,
} from "lucide-react";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // AUTH LOGIC: Checks if a user is logged in (e.g., checking localStorage)
  // Replace "user_token" with whatever key you use for your login session
  const isLoggedIn = !!localStorage.getItem("user_token");

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/donate");
    } else {
      navigate("/signup");
    }
  };

  const features = [
    {
      title: t("home.features.easyListing"),
      icon: <ClipboardList size={24} />,
      desc: t("home.features.easyListingDesc"),
    },
    {
      title: t("home.features.findCharities"),
      icon: <Search size={24} />,
      desc: t("home.features.findCharitiesDesc"),
    },
    {
      title: t("home.features.schedulePickup"),
      icon: <CalendarClock size={24} />,
      desc: t("home.features.schedulePickupDesc"),
    },
    {
      title: t("home.features.trackImpact"),
      icon: <LineChart size={24} />,
      desc: t("home.features.trackImpactDesc"),
    },
    {
      title: t("home.features.notifications"),
      icon: <Bell size={24} />,
      desc: t("home.features.notificationsDesc"),
    },
    {
      title: t("home.features.rateReview"),
      icon: <Star size={24} />,
      desc: t("home.features.rateReviewDesc"),
    },
  ];

  const categories = [
    { name: t("home.categories.clothing"), icon: <Shirt size={32} /> },
    { name: t("home.categories.furniture"), icon: <Sofa size={32} /> },
    { name: t("home.categories.books"), icon: <Book size={32} /> },
    { name: t("home.categories.electronics"), icon: <Laptop size={32} /> },
    { name: t("home.categories.baby"), icon: <Baby size={32} /> },
    { name: t("home.categories.others"), icon: <Boxes size={32} /> },
  ];

  const steps = [
    {
      id: "01",
      title: t("home.steps.createAccount.title"),
      desc: t("home.steps.createAccount.desc"),
    },
    {
      id: "02",
      title: t("home.steps.listBrowse.title"),
      desc: t("home.steps.listBrowse.desc"),
    },
    {
      id: "03",
      title: t("home.steps.connectSchedule.title"),
      desc: t("home.steps.connectSchedule.desc"),
    },
    {
      id: "04",
      title: t("home.steps.makeImpact.title"),
      desc: t("home.steps.makeImpact.desc"),
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-12 md:py-16 gap-8 md:gap-16">
        <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
          <span className="text-[#B33D11] bg-[#FDF2F0] px-3 py-1 rounded-full text-sm font-semibold">
            {t("home.hero.tagline")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            {t("home.hero.titlePart1")}
            <br />
            <span className="text-[#B33D11]">{t("home.hero.titlePart2")}</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-full md:max-w-md mx-auto md:mx-0">
            {t("home.hero.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <button
              onClick={handleGetStarted}
              className="bg-[#B33D11] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#96320e] transition-all"
            >
              {t("home.hero.getStarted")}
            </button>
            <Link to="/how-it-works">
              <button className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                {t("home.hero.howItWorks")}
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <img
            src={hero}
            alt={t("home.hero.alt")}
            className="rounded-2xl shadow-xl object-cover w-full h-auto"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#F9F9F9] py-12 md:py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h4 className="text-[#B33D11] font-bold mb-2">
            {t("home.features.title")}
          </h4>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12">
            {t("home.features.subtitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-all"
              >
                <div className="text-gray-700 mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h4 className="text-[#B33D11] font-bold mb-2">
            {t("home.categories.title")}
          </h4>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            {t("home.categories.subtitle")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((c, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-6 flex flex-col items-center gap-3 hover:border-[#B33D11] hover:text-[#B33D11] transition-all cursor-pointer"
              >
                {c.icon}
                <span className="font-bold text-sm">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-6 text-center">
        <h4 className="text-[#B33D11] font-bold mb-2 uppercase tracking-widest text-sm">
          {t("home.steps.title")}
        </h4>
        <h2 className="text-2xl sm:text-3xl font-bold mb-12 italic">
          {t("home.steps.subtitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div key={step.id} className="space-y-4 text-left md:text-center">
              <span className="text-4xl font-extrabold text-[#38C1E2] block">
                {step.id}
              </span>
              <h3 className="font-bold text-xl">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
