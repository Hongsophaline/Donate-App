import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ChangeEvent } from "react";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  // On mount, load language from localStorage if exists
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <select
      value={i18n.language.slice(0, 2)} // ensure we use "en", "km", or "zh"
      onChange={handleChange}
      className="border border-gray-300 rounded-md px-2 py-1 text-sm cursor-pointer"
    >
      <option value="km">ភាសាខ្មែរ</option>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  );
};

export default LanguageSelector;
