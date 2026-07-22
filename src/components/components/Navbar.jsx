import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Film,
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  X,
  Shield,
} from "lucide-react";
import AppContext from "../context/AppContext";

export default function Navbar({ searchInputRef }) {
  const {
    theme,
    setTheme,
    searchQuery,
    setSearchQuery,
    isAuthenticated,
    user,
    logout,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/movies", label: "Browse Movies" },
    { to: "/genres", label: "Genres" },
    { to: "/trending", label: "Trending" },
    { to: "/favorites", label: "Favorites" },
    { to: "/watchlist", label: "Watchlist" },
    { to: "/contact", label: "Support" },
  ];

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 0) {
      navigate(`/movies?search=${encodeURIComponent(val)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    navigate("/movies");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-zinc-900 px-4 md:px-12 py-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-8">
        <NavLink
          to="/"
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <Film className="text-red-600 w-7 h-7 fill-red-600" />
          <span className="text-xl font-black tracking-tighter text-white">
            FLIX<span className="text-red-600">APP</span>
          </span>
        </NavLink>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-all hover:text-red-500 ${
                  isActive
                    ? "text-red-500 border-b-2 border-red-600 pb-1"
                    : "text-zinc-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && user?.role === "admin" && (
            <a
              href="http://localhost:8000/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold tracking-wide transition-all hover:text-red-500 text-zinc-400 flex items-center gap-1"
            >
              <Shield size={14} /> Admin
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-zinc-900/90 border border-zinc-800 rounded-full px-4 py-1.5 w-64 focus-within:w-80 focus-within:border-zinc-700 transition-all duration-300">
          <Search className="text-zinc-400 mr-2" size={16} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search titles, actors..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setFocused(true)}
            className="bg-transparent text-white focus:outline-none w-full text-xs"
            aria-label="Search movies"
          />
          {searchQuery && focused && (
            <button
              onClick={clearSearch}
              className="text-zinc-500 hover:text-white ml-1"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition"
          aria-label="Toggle dark/light theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <NavLink
          to="/profile"
          className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition"
          aria-label="Go to profile"
        >
          <User size={16} />
        </NavLink>

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5"
          >
            <LogOut size={12} /> Sign Out
          </button>
        ) : (
          <NavLink
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold transition shadow-md shadow-red-600/10"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  );
}
