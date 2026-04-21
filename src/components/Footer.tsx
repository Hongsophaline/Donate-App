import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 1. Import hook
import logoImg from "../assets/logo-removebg-preview.png";

const Footer = () => {
  const { t } = useTranslation(); // 2. Initialize translation

  return (
    <footer className="bg-[#B33D11] text-white pt-12 pb-6 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1: Logo and Description */}
        <div className="flex flex-col gap-4">
          <img
            src={logoImg}
            alt="KindDrop Logo"
            width={120}
            height={45}
            className="object-contain brightness-110"
          />
          <p className="text-sm leading-relaxed text-gray-200">
            {t("footer.description")}
          </p>
        </div>

        {/* Column 2: Platform */}
        <div>
          <h3 className="font-bold text-lg mb-4">{t("footer.platform")}</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-200">
            <li>
              <Link to="/donate" className="hover:underline">
                {t("footer.donateItems")}
              </Link>
            </li>
            <li>
              <Link to="/browse" className="hover:underline">
                {t("footer.browseDonations")}
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:underline">
                {t("footer.howItWorks")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="font-bold text-lg mb-4">{t("footer.support")}</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-200">
            <li>
              <Link to="/contact" className="hover:underline">
                {t("footer.contactUs")}
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:underline">
                {t("footer.faq")}
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:underline">
                {t("footer.helpCenter")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div>
          <h3 className="font-bold text-lg mb-4">{t("footer.legal")}</h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-200">
            <li>
              <Link to="/privacy" className="hover:underline">
                {t("footer.privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                {t("footer.termsOfService")}
              </Link>
            </li>
            <li>
              <Link to="/cookie" className="hover:underline">
                {t("footer.cookiePolicy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="mt-12 pt-6 border-t border-white/20 text-center text-sm text-gray-200">
        <p>{t("footer.copyright")}</p>
      </div>
    </footer>
  );
};

export default Footer;
