import { useContext } from "react";
import { TrendingUp } from "lucide-react";
import AppContext from "../context/AppContext";
import MovieCard from "../components/MovieCard";
import { SkeletonGrid } from "../components/Skeleton";

export default function TrendingPage() {
  const { movies, trendingMovies, loading } = useContext(AppContext);

  const trending =
    trendingMovies.length > 0
      ? trendingMovies
      : movies.filter((m) => m.is_trending);

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
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <TrendingUp className="text-red-500" /> Hot Content Indexes
        </h2>
        <p className="text-zinc-400 text-sm">
          High consumption media objects tracked across the architecture system
          over the last 24 hours
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {trending.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
