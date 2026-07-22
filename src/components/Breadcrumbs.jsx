import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const ROUTE_NAMES = {
  "": "Home",
  movies: "Movies",
  genres: "Genres",
  trending: "Trending",
  favorites: "Favorites",
  watchlist: "Watchlist",
  profile: "Profile",
  login: "Login",
  register: "Register",
  contact: "Support",
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav
      className="px-6 md:px-16 py-3 flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 overflow-x-auto scrollbar-none"
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="hover:text-red-500 transition flex items-center gap-1 shrink-0"
      >
        <Home size={12} /> Home
      </Link>
      {segments.map((segment, i) => {
        const path = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const name =
          ROUTE_NAMES[segment] ||
          (isLast && /^\d+$/.test(segment) ? "Details" : segment);

        return (
          <span key={path} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight size={10} className="text-zinc-700" />
            {isLast ? (
              <span className="text-zinc-300">{name}</span>
            ) : (
              <Link to={path} className="hover:text-red-500 transition">
                {name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
