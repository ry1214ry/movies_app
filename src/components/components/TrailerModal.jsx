import { useEffect } from "react";
import { X } from "lucide-react";

export default function TrailerModal({ open, onClose, trailerUrl, title }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Trailer: ${title}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-red-600 text-white rounded-full transition"
          aria-label="Close trailer"
        >
          <X size={18} />
        </button>
        <iframe
          className="w-full h-full"
          src={trailerUrl}
          title={`Trailer: ${title}`}
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      </div>
    </div>
  );
}
