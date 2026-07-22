import { useContext } from "react";
import { Bookmark } from "lucide-react";
import AppContext from "../context/AppContext";
import MovieCard from "../components/MovieCard";
import EmptyState from "../components/EmptyState";

export default function WatchlistPage() {
  const { watchlist, movies } = useContext(AppContext);
  const matchedMovies = movies.filter((m) => watchlist.includes(m.id));

  return (
    <div className="px-6 md:px-16 py-12 space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <Bookmark className="text-red-500" /> My Watchlist Queue
        </h2>
        <p className="text-zinc-400 text-sm">
          Movies you have queued up for future viewing sessions
        </p>
      </div>
      {matchedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {matchedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState message="Your watchlist is empty. Browse movies and bookmark the ones you want to watch later." />
      )}
    </div>
  );
}
