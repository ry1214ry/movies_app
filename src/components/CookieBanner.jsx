import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 p-4 md:px-12 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-zinc-400 text-xs leading-relaxed">
        We use cookies to improve your experience. By continuing to use this
        site, you agree to our use of cookies.
      </p>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleDecline}
          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold transition"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
