import { useContext } from "react";
import AppContext from "../context/AppContext";
import MovieCard from "../components/MovieCard";
import EmptyState from "../components/EmptyState";

export default function FavoritesPage() {
  const { favorites, movies } = useContext(AppContext);
  const matchedMovies = movies.filter((m) => favorites.includes(m.id));

  return (
    <div className="px-6 md:px-16 py-12 space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          My Favorite Showcase
        </h2>
        <p className="text-zinc-400 text-sm">
          Your personally cataloged collection of standout cinema titles
        </p>
      </div>
      {matchedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {matchedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState message="No titles have been designated to your favorites catalog yet." />
      )}
    </div>
  );
}
