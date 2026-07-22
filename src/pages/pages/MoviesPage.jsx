import { useMemo, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import AppContext from "../context/AppContext";
import MovieCard from "../components/MovieCard";
import EmptyState from "../components/EmptyState";
import { SkeletonGrid } from "../components/Skeleton";

const PER_PAGE = 20;

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest_rated", label: "Highest Rated" },
  { value: "lowest_rated", label: "Lowest Rated" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
];

const DEFAULT_FILTERS = {
  year_from: "",
  year_to: "",
  rating_min: "",
};

export default function MoviesPage() {
  const { setSearchQuery, genres, movies, loading } =
    useContext(AppContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    year_from: searchParams.get("year_from") || "",
    year_to: searchParams.get("year_to") || "",
    rating_min: searchParams.get("rating_min") || "",
  });

  const urlSearch = searchParams.get("search") || "";
  const urlGenre = searchParams.get("genre") || "All";
  const urlSort = searchParams.get("sort") || "latest";
  const urlPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const urlYearFrom = searchParams.get("year_from") || "";
  const urlYearTo = searchParams.get("year_to") || "";
  const urlRatingMin = searchParams.get("rating_min") || "";

  const genreNames = useMemo(() => genres.map((g) => g.name), [genres]);

  const hasActiveFilters =
    urlSearch ||
    urlGenre !== "All" ||
    urlSort !== "latest" ||
    urlYearFrom ||
    urlYearTo ||
    urlRatingMin;

  const updateParams = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const defaultVal =
      key === "genre" ? "All" : key === "sort" ? "latest" : "";
    if (value && value !== defaultVal) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== "page") {
      next.delete("page");
    }
    setSearchParams(next, { replace: true });
  };

  const goToPage = (page) => {
    const next = new URLSearchParams(searchParams);
    if (page > 1) {
      next.set("page", page.toString());
    } else {
      next.delete("page");
    }
    setSearchParams(next, { replace: true });
  };

  const applyAdvancedFilters = () => {
    const next = new URLSearchParams(searchParams);
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });
    next.delete("page");
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => {
    setSearchQuery("");
    setLocalFilters({ ...DEFAULT_FILTERS });
    setSearchParams({}, { replace: true });
  };

  const clearAdvancedFilters = () => {
    setLocalFilters({ ...DEFAULT_FILTERS });
    const next = new URLSearchParams(searchParams);
    next.delete("year_from");
    next.delete("year_to");
    next.delete("rating_min");
    next.delete("page");
    setSearchParams(next, { replace: true });
  };

  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        const q = urlSearch.toLowerCase();
        const matchSearch =
          !q ||
          movie.title.toLowerCase().includes(q) ||
          movie.director.toLowerCase().includes(q) ||
          movie.cast.some((actor) => actor.toLowerCase().includes(q));
        const matchGenre =
          urlGenre === "All" || movie.genre === urlGenre;
        const matchYearFrom = !urlYearFrom || movie.year >= Number(urlYearFrom);
        const matchYearTo = !urlYearTo || movie.year <= Number(urlYearTo);
        const matchRating =
          !urlRatingMin || movie.rating >= Number(urlRatingMin);
        return (
          matchSearch &&
          matchGenre &&
          matchYearFrom &&
          matchYearTo &&
          matchRating
        );
      })
      .sort((a, b) => {
        switch (urlSort) {
          case "oldest":
            return a.year - b.year;
          case "highest_rated":
            return b.rating - a.rating;
          case "lowest_rated":
            return a.rating - b.rating;
          case "title_asc":
            return a.title.localeCompare(b.title);
          case "title_desc":
            return b.title.localeCompare(a.title);
          default:
            return b.year - a.year;
        }
      });
  }, [urlSearch, urlGenre, urlSort, urlYearFrom, urlYearTo, urlRatingMin, movies]);

  const totalPages = Math.ceil(filteredMovies.length / PER_PAGE);
  const currentPage = Math.min(urlPage, totalPages || 1);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  if (loading) {
    return (
      <div className="px-6 md:px-16 py-12 space-y-8">
        <div className="h-10 w-64 bg-zinc-900 rounded animate-pulse" />
        <SkeletonGrid count={20} />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Full Media Catalog
          </h2>
          <p className="text-zinc-400 text-sm">
            {filteredMovies.length} title
            {filteredMovies.length !== 1 ? "s" : ""} found
            {urlSearch && (
              <span>
                {" "}
                for &quot;
                <span className="text-red-500">{urlSearch}</span>&quot;
              </span>
            )}
            {urlGenre !== "All" && (
              <span>
                {" "}
                in <span className="text-red-500">{urlGenre}</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-zinc-500 hover:text-red-500 text-xs font-bold transition flex items-center gap-1"
            >
              <X size={14} /> Clear All
            </button>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`text-xs font-bold transition flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
              showAdvanced
                ? "bg-red-600/10 border-red-600/30 text-red-500"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal size={14} /> Filters
            {showAdvanced ? (
              <ChevronUp size={12} />
            ) : (
              <ChevronDown size={12} />
            )}
          </button>
          <select
            value={urlSort}
            onChange={(e) => updateParams("sort", e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-red-600 outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Advanced Filters
            </h3>
            {(localFilters.year_from ||
              localFilters.year_to ||
              localFilters.rating_min) && (
              <button
                onClick={clearAdvancedFilters}
                className="text-zinc-500 hover:text-red-500 text-xs font-bold transition flex items-center gap-1"
              >
                <X size={12} /> Reset
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Year From
              </label>
              <input
                type="number"
                min="1900"
                max="2030"
                value={localFilters.year_from}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    year_from: e.target.value,
                  }))
                }
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="2000"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Year To
              </label>
              <input
                type="number"
                min="1900"
                max="2030"
                value={localFilters.year_to}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    year_to: e.target.value,
                  }))
                }
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="2026"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Min Rating
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={localFilters.rating_min || 0}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      rating_min: e.target.value,
                    }))
                  }
                  className="flex-1 accent-red-600"
                />
                <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5 min-w-[40px]">
                  <Star size={10} fill="currentColor" />{" "}
                  {localFilters.rating_min || 0}
                </span>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={applyAdvancedFilters}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["All", ...genreNames].map((genre) => (
          <button
            key={genre}
            onClick={() => updateParams("genre", genre)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              urlGenre === genre
                ? "bg-red-600 text-white shadow-lg"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Results */}
      {paginatedMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {paginatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    if (p === 1 || p === totalPages) return true;
                    if (Math.abs(p - currentPage) <= 1) return true;
                    return false;
                  })
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`dots-${i}`}
                        className="text-zinc-600 text-xs"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`w-8 h-8 rounded-full text-xs font-bold transition ${
                          p === currentPage
                            ? "bg-red-600 text-white"
                            : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState message="No movie listings found fitting these filter parameters." />
      )}
    </div>
  );
}
