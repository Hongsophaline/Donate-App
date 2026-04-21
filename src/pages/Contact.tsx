"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Send, ChevronDown, MessageSquareMore } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function ContactFAQPage() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const faqs: FAQ[] = [
    { question: t("contact.faq.q1"), answer: t("contact.faq.a1") },
    { question: t("contact.faq.q2"), answer: t("contact.faq.a2") },
    { question: t("contact.faq.q3"), answer: t("contact.faq.a3") },
    { question: t("contact.faq.q4"), answer: t("contact.faq.a4") },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center py-16 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          {t("contact.title")}
        </h1>
        <p className="text-gray-500 text-sm">{t("contact.subtitle")}</p>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Contact Form */}
        <div className="space-y-8">
          <h2 className="text-lg font-bold text-gray-900">
            {t("contact.getInTouch")}
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-md">
              <span className="p-2 bg-white rounded-md shadow-sm">
                <Mail className="h-5 w-5 text-gray-500" />
              </span>
              <span className="text-sm text-gray-700">
                hong.sophaline@institute.com
              </span>
            </div>

            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-md">
              <span className="p-2 bg-white rounded-md shadow-sm">
                <Send className="h-5 w-5 text-gray-500" />
              </span>
              <span className="text-sm text-gray-700">
                +855 70 835 672 / 97 420 570
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder={t("contact.form.name")}
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder={t("contact.form.email")}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <textarea
              name="message"
              placeholder={t("contact.form.message")}
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-md shadow-md transition-colors"
            >
              {t("contact.form.submit")}
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">
              {t("contact.faq.title")}
            </h2>
            <MessageSquareMore className="h-5 w-5 text-purple-500" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="text-sm font-semibold text-gray-800">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      activeFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`px-5 overflow-hidden transition-all duration-300 ${
                    activeFaq === index ? "max-h-40 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-xs text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
