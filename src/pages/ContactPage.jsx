import { useContext, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import AppContext from "../context/AppContext";
import { submitContact } from "../services/api";

export default function ContactPage() {
  const { triggerNotification } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContact(name, email, message);
      triggerNotification("Support message sent successfully");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      triggerNotification(err.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 md:px-16 py-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          Corporate Support Desks
        </h2>
        <p className="text-zinc-400 text-sm">
          Initiate secure connection requests to our physical or network help
          nodes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Email Vector Link
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Message Description
              </label>
              <textarea
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none resize-none"
                placeholder="Elaborate regarding system issues..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition tracking-wide disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Transmit Ticket Payload"}
            </button>
          </form>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-black text-white">
              Endpoint Routing Datapoints
            </h3>
            <div className="flex items-center gap-3 text-zinc-400">
              <MapPin size={16} className="text-red-500" />{" "}
              <span>Phnom Penh, Cambodia</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Phone size={16} className="text-red-500" />{" "}
              <span>+855 88 999 7777</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Mail size={16} className="text-red-500" />{" "}
              <span>support@flixapp-cambodia.com</span>
            </div>
          </div>
          <div className="w-full h-44 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative flex items-center p-6 shadow-inner">
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block">
                Operational Node
              </span>
              <p className="text-white font-bold text-sm">
                HQ Office Hub - Southeast Asia
              </p>
            </div>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600')`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
