import { useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { TrendingUp, ChevronDown } from "lucide-react";
import AppContext from "../context/AppContext";
import MovieCard from "../components/MovieCard";
import { SkeletonGrid } from "../components/Skeleton";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest_rated", label: "Highest Rated" },
  { value: "lowest_rated", label: "Lowest Rated" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
];

export default function TrendingPage() {
  const { movies, trendingMovies, loading } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sort") || "latest";

  const trending =
    trendingMovies.length > 0
      ? trendingMovies
      : movies.filter((m) => m.is_trending);

  const sorted = useMemo(() => {
    const copy = [...trending];
    switch (currentSort) {
      case "oldest":
        return copy.sort((a, b) => a.year - b.year);
      case "latest":
        return copy.sort((a, b) => b.year - a.year);
      case "highest_rated":
        return copy.sort((a, b) => b.rating - a.rating);
      case "lowest_rated":
        return copy.sort((a, b) => a.rating - b.rating);
      case "title_asc":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "title_desc":
        return copy.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return copy;
    }
  }, [trending, currentSort]);

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="px-6 md:px-16 py-12 space-y-8">
        <div className="h-10 w-64 bg-zinc-900 rounded animate-pulse" />
        <SkeletonGrid count={12} />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="text-red-500" /> Hot Content Indexes
          </h2>
          <p className="text-zinc-400 text-sm">
            High consumption media objects tracked across the architecture system
            over the last 24 hours
          </p>
        </div>
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-xl px-4 py-2.5 pr-9 focus:ring-2 focus:ring-red-600 outline-none cursor-pointer"
            aria-label="Sort trending movies"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {sorted.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
