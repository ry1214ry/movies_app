import { NavLink } from "react-router-dom";
import { Film, Grid, Heart, Bookmark, Search } from "lucide-react";

export default function MobileMenu({ onSearchOpen }) {
  const items = [
    { to: "/", label: "Home", icon: Film },
    { to: "/movies", label: "Browse", icon: Grid },
    { action: onSearchOpen, label: "Search", icon: Search },
    { to: "/favorites", label: "Saved", icon: Heart },
    { to: "/watchlist", label: "Watch", icon: Bookmark },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-zinc-900 py-3 px-4 flex justify-between items-center md:hidden">
      {items.map((item, i) => {
        const Icon = item.icon;
        if (item.action) {
          return (
            <button
              key={i}
              onClick={item.action}
              className="flex flex-col items-center gap-1 transition-colors text-zinc-500"
              aria-label="Search movies"
            >
              <Icon size={18} />
              <span className="text-[10px] font-bold tracking-tight">
                {item.label}
              </span>
            </button>
          );
        }
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${isActive ? "text-red-500" : "text-zinc-500"}`
            }
          >
            <Icon size={18} />
            <span className="text-[10px] font-bold tracking-tight">
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
}
