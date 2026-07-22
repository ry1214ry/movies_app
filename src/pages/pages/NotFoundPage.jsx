import { useNavigate } from "react-router-dom";
import { Film, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-16">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
          <Film size={40} className="text-zinc-700" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-white tracking-tighter">
            404
          </h1>
          <h2 className="text-xl font-black text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full text-sm transition shadow-lg shadow-red-600/20 inline-flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
      </div>
    </div>
  );
}
