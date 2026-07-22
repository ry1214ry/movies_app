import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../context/AppContext";

export default function LoginPage() {
  const { login, triggerNotification } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
      triggerNotification(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-16">
      <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Access Your Portal
          </h2>
          <p className="text-zinc-400 text-xs">
            Provide valid profile credentials to sign in
          </p>
        </div>
        {error && (
          <p className="text-red-500 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl p-2">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="name@domain.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Security Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-red-600/10 disabled:opacity-50"
          >
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="text-center text-xs text-zinc-400">
          New to FlixApp?{" "}
          <Link
            to="/register"
            className="text-red-500 font-bold hover:underline"
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
