import { useContext } from "react";
import { Info } from "lucide-react";
import AppContext from "../context/AppContext";

export default function NotificationToast() {
  const { notifications } = useContext(AppContext);

  return (
    <div className="fixed top-24 right-6 z-50 space-y-2 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 border border-red-500 tracking-wide transition-all pointer-events-auto"
        >
          <Info size={16} /> {n.message}
        </div>
      ))}
    </div>
  );
}
