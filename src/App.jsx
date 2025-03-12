import { useEffect, useState } from "react";
import AppRoutes from "./routes/appRoutes";
import English from "../src/assets/images/english.png";
import French from "../src/assets/images/france.png";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaWhatsappSquare } from "react-icons/fa";
import { Toaster } from "react-hot-toast";

function App() {
  const [selectedLang, setSelectedLang] = useState("en");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Prevent multiple script injections
    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      // Define function before script loads
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,fr", autoDisplay: true },
          "google_translate_element"
        );
      };

      // Inject Google Translate script
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (lang) => {
    setSelectedLang(lang);

    const googleTranslateSelect = document.querySelector(".goog-te-combo");
    if (googleTranslateSelect) {
      googleTranslateSelect.value = lang;
      googleTranslateSelect.dispatchEvent(new Event("change"));
    }

    setIsDropdownOpen(false);
  };

  return (
    <>
    <Toaster  />
      <AppRoutes />

      {/* Google Translate Element */}
      <div id="google_translate_element" ></div>
      <a href="https://wa.me/+923116692450" target="_blank">
      <FaWhatsappSquare  className="text-[#21C063] text-5xl fixed left-[50px] bottom-[20px] w-auto bg-white rounded "/>
     </a>


      {/* Language Switcher */}
      {/* <div className="fixed bottom-5 right-5 bg-white rounded-lg shadow-lg p-2 ">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg border border-gray-300"
        >
          <img src={selectedLang === "en" ? English : French} alt={selectedLang} className="w-6 h-6" />
          {selectedLang === "en" ? "English" : "Français"}
          <IoMdArrowDropdown />
        </button>

      
        {isDropdownOpen && (
          <div className="absolute bottom-12 right-0 bg-white w-full shadow-md rounded-lg border border-gray-300">
            <button
              onClick={() => changeLanguage("en")}
              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
            >
              <img src={English} alt="English" className="w-5 h-5" />
              English
            </button>
            <button
              onClick={() => changeLanguage("fr")}
              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
            >
              <img src={French} alt="French" className="w-5 h-5" />
              Français
            </button>
          </div>
        )}
      </div> */}
    </>
  );
}

export default App;