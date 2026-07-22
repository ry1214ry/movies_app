import { useContext, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import AppContext from "../context/AppContext";
import { submitContact } from "../services/api";

export default function ContactPage() {
  const { triggerNotification } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Full name is required";
    else if (name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address";
    if (!message.trim()) errs.message = "Message is required";
    else if (message.trim().length < 10)
      errs.message = "Message must be at least 10 characters";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitContact(name, email, message);
      triggerNotification("Support message sent successfully");
      setName("");
      setEmail("");
      setMessage("");
      setFieldErrors({});
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
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name)
                    setFieldErrors((p) => ({ ...p, name: "" }));
                }}
                className={`w-full bg-zinc-900 border text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none ${
                  fieldErrors.name ? "border-red-500" : "border-zinc-800"
                }`}
                placeholder="John Doe"
                aria-label="Full name"
                aria-invalid={!!fieldErrors.name}
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-[10px]">{fieldErrors.name}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Email Vector Link
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email)
                    setFieldErrors((p) => ({ ...p, email: "" }));
                }}
                className={`w-full bg-zinc-900 border text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none ${
                  fieldErrors.email ? "border-red-500" : "border-zinc-800"
                }`}
                placeholder="john@company.com"
                aria-label="Email address"
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-[10px]">{fieldErrors.email}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Message Description
              </label>
              <textarea
                rows="4"
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (fieldErrors.message)
                    setFieldErrors((p) => ({ ...p, message: "" }));
                }}
                className={`w-full bg-zinc-900 border text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none resize-none ${
                  fieldErrors.message ? "border-red-500" : "border-zinc-800"
                }`}
                placeholder="Elaborate regarding system issues..."
                aria-label="Message"
                aria-invalid={!!fieldErrors.message}
              />
              {fieldErrors.message && (
                <p className="text-red-500 text-[10px]">{fieldErrors.message}</p>
              )}
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
