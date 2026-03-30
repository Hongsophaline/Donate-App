"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface Step {
  id: string;
  title: string;
  desc: string;
}

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps: Step[] = [
    {
      id: "01",
      title: t("howItWorks.steps.step1.title", "Sign Up"),
      desc: t(
        "howItWorks.steps.step1.desc",
        "Create an account to start donating or requesting items.",
      ),
    },
    {
      id: "02",
      title: t("howItWorks.steps.step2.title", "List Your Items"),
      desc: t(
        "howItWorks.steps.step2.desc",
        "Fill in the details and photos of items you want to donate.",
      ),
    },
    {
      id: "03",
      title: t("howItWorks.steps.step3.title", "Browse Items"),
      desc: t(
        "howItWorks.steps.step3.desc",
        "Search for items available in your area and filter by category.",
      ),
    },
    {
      id: "04",
      title: t("howItWorks.steps.step4.title", "Request & Receive"),
      desc: t(
        "howItWorks.steps.step4.desc",
        "Request items and coordinate with donors for pickup or delivery.",
      ),
    },
  ];

  return (
    <section className="py-20 px-4 md:px-10 text-center bg-gray-50">
      <h4 className="text-[#B33D11] font-bold mb-2 uppercase tracking-widest text-sm">
        {t("howItWorks.subtitle", "How It Works")}
      </h4>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 italic text-gray-900">
        {t("howItWorks.title", "Simple Steps to Give & Receive")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
        {steps.map((step: Step) => (
          <div
            key={step.id}
            className="space-y-4 p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
          >
            <span className="text-5xl font-extrabold text-[#38C1E2] block">
              {step.id}
            </span>
            <h3 className="font-bold text-xl text-gray-900">{step.title}</h3>
            <p className="text-gray-500 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
