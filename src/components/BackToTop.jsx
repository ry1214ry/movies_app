import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 md:bottom-8 right-6 z-40 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl shadow-red-600/20 transition-all duration-300"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
