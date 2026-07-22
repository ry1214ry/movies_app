import { useState, useCallback, useContext } from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

export default function MobileSearchOverlay({ open, onClose }) {
  const { searchQuery, setSearchQuery, movies } = useContext(AppContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleOpen = useCallback(() => {
    setQuery(searchQuery || "");
  }, [searchQuery]);

  if (open) {
    handleOpen();
  }

  const results = query.trim()
    ? movies
        .filter(
          (m) =>
            m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.director?.toLowerCase().includes(query.toLowerCase()) ||
            m.cast?.some((a) =>
              a.toLowerCase().includes(query.toLowerCase()),
            ),
        )
        .slice(0, 8)
    : [];

  const handleSelect = useCallback(
    (movieId) => {
      setSearchQuery(query);
      onClose();
      navigate(`/movies/${movieId}`);
    },
    [query, navigate, setSearchQuery, onClose],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 md:hidden flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Search movies"
    >
      <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-900">
        <div className="flex-1 flex items-center bg-zinc-900 rounded-xl px-4 py-3">
          <Search size={18} className="text-zinc-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search titles, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-white focus:outline-none w-full text-sm"
          />
        </div>
        <button
          onClick={onClose}
          className="p-3 text-zinc-400 hover:text-white transition"
          aria-label="Close search"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {results.length > 0 ? (
          results.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleSelect(movie.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 transition text-left"
            >
              <img
                src={movie.poster}
                alt=""
                className="w-10 h-14 rounded-lg object-cover bg-zinc-900"
              />
              <div>
                <p className="text-sm font-bold text-white line-clamp-1">
                  {movie.title}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {movie.genre} &middot; {movie.year}
                </p>
              </div>
            </button>
          ))
        ) : query.trim() ? (
          <p className="text-center text-zinc-600 text-sm py-8">
            No results found
          </p>
        ) : (
          <p className="text-center text-zinc-600 text-sm py-8">
            Start typing to search...
          </p>
        )}
      </div>
    </div>
  );
}
